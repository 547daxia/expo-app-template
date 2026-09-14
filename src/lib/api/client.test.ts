import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Env from 'env';

import { SessionChangedError, signIn, signOut, useAuthStore } from '@/lib/auth/session-store';
import { getToken, removeToken, setToken } from '@/lib/auth/utils';

import { client } from './client';

jest.mock('@/lib/auth/utils');

const mockGetToken = jest.mocked(getToken);
const mockSetToken = jest.mocked(setToken);
const mockRemoveToken = jest.mocked(removeToken);

/* eslint-disable max-lines-per-function */
describe('aPI client interceptors', () => {
  let mock: MockAdapter;
  let axiosMock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(client);
    axiosMock = new MockAdapter(axios);
    jest.clearAllMocks();
    useAuthStore.setState({ status: 'idle', token: null });
    mockGetToken.mockResolvedValue(null);
    mockSetToken.mockResolvedValue();
    mockRemoveToken.mockResolvedValue();
  });

  afterEach(() => {
    mock.restore();
    axiosMock.restore();
  });

  describe('request interceptor: token injection', () => {
    it('injects Bearer token when the session has one', async () => {
      useAuthStore.setState({
        status: 'signIn',
        token: { access: 'test-access-token', refresh: 'test-refresh-token' },
      });

      mock.onGet('/test').reply((config) => {
        expect(config.headers?.Authorization).toBe('Bearer test-access-token');
        return [200, { data: 'success' }];
      });

      await client.get('/test');
    });

    it('does not inject Authorization header without a session token', async () => {
      mock.onGet('/test').reply((config) => {
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, { data: 'success' }];
      });

      await client.get('/test');
    });
  });

  describe('response interceptor: 401 refresh', () => {
    it('refreshes the token, updates the session, and retries the request', async () => {
      useAuthStore.setState({
        status: 'signIn',
        token: { access: 'expired-access-token', refresh: 'valid-refresh-token' },
      });

      mock.onGet('/protected').replyOnce(401);

      // Mock refresh endpoint on the base axios instance
      axiosMock.onPost(`${Env.EXPO_PUBLIC_API_URL}/auth/refresh`).replyOnce(200, {
        access: 'new-access-token',
        refresh: 'new-refresh-token',
      });

      // Retry with new token succeeds
      mock.onGet('/protected').replyOnce((config) => {
        expect(config.headers?.Authorization).toBe('Bearer new-access-token');
        return [200, { data: 'protected-data' }];
      });

      const response = await client.get('/protected');

      expect(response.data).toEqual({ data: 'protected-data' });
      expect(mockSetToken).toHaveBeenCalledWith({
        access: 'new-access-token',
        refresh: 'new-refresh-token',
      });
      expect(useAuthStore.getState()).toMatchObject({
        status: 'signIn',
        token: { access: 'new-access-token', refresh: 'new-refresh-token' },
      });
    });

    it('rejects when no refresh token is available', async () => {
      mock.onGet('/protected').replyOnce(401);

      await expect(client.get('/protected')).rejects.toThrow('No refresh token available');
    });

    it('signs out when the refresh attempt fails', async () => {
      useAuthStore.setState({
        status: 'signIn',
        token: { access: 'expired-access-token', refresh: 'invalid-refresh-token' },
      });

      mock.onGet('/protected').replyOnce(401);
      axiosMock.onPost(`${Env.EXPO_PUBLIC_API_URL}/auth/refresh`).replyOnce(401);

      await expect(client.get('/protected')).rejects.toThrow();

      expect(mockRemoveToken).toHaveBeenCalledTimes(1);
      expect(useAuthStore.getState()).toMatchObject({ status: 'signOut', token: null });
    });

    it('queues concurrent 401 requests to share a single refresh', async () => {
      useAuthStore.setState({
        status: 'signIn',
        token: { access: 'expired-access-token', refresh: 'valid-refresh-token' },
      });

      // All requests fail with 401
      mock.onGet('/protected-1').replyOnce(401);
      mock.onGet('/protected-2').replyOnce(401);
      mock.onGet('/protected-3').replyOnce(401);

      // Refresh endpoint called only once
      axiosMock.onPost(`${Env.EXPO_PUBLIC_API_URL}/auth/refresh`).replyOnce(200, {
        access: 'new-access-token',
        refresh: 'new-refresh-token',
      });

      // All retries succeed with new token
      mock.onGet('/protected-1').replyOnce(200, { data: 'data-1' });
      mock.onGet('/protected-2').replyOnce(200, { data: 'data-2' });
      mock.onGet('/protected-3').replyOnce(200, { data: 'data-3' });

      const [response1, response2, response3] = await Promise.all([
        client.get('/protected-1'),
        client.get('/protected-2'),
        client.get('/protected-3'),
      ]);

      expect(response1.data).toEqual({ data: 'data-1' });
      expect(response2.data).toEqual({ data: 'data-2' });
      expect(response3.data).toEqual({ data: 'data-3' });

      // Refresh called only once on base axios instance
      expect(axiosMock.history.post.filter(req => req.url?.includes('/auth/refresh'))).toHaveLength(1);
      expect(axiosMock.history.post[0]?.timeout).toBe(15_000);
      expect(mockSetToken).toHaveBeenCalledTimes(1);
    });

    it('rejects every queued request and signs out when refresh times out', async () => {
      useAuthStore.setState({
        status: 'signIn',
        token: { access: 'expired-access-token', refresh: 'valid-refresh-token' },
      });

      mock.onGet('/protected-1').replyOnce(401);
      mock.onGet('/protected-2').replyOnce(401);
      axiosMock.onPost(`${Env.EXPO_PUBLIC_API_URL}/auth/refresh`).timeoutOnce();

      const results = await Promise.allSettled([
        client.get('/protected-1'),
        client.get('/protected-2'),
      ]);

      expect(results.every(result => result.status === 'rejected')).toBe(true);
      expect(axiosMock.history.post).toHaveLength(1);
      expect(axiosMock.history.post[0]?.timeout).toBe(15_000);
      expect(mockRemoveToken).toHaveBeenCalledTimes(1);
      expect(useAuthStore.getState()).toMatchObject({ status: 'signOut', token: null });
    });

    it('does not retry when refresh endpoint itself returns 401', async () => {
      useAuthStore.setState({
        status: 'signIn',
        token: { access: 'expired-access-token', refresh: 'valid-refresh-token' },
      });

      mock.onGet('/protected').replyOnce(401);
      axiosMock.onPost(`${Env.EXPO_PUBLIC_API_URL}/auth/refresh`).reply(401);

      await expect(client.get('/protected')).rejects.toThrow();

      // Should only attempt refresh once, not infinite loop
      expect(axiosMock.history.post.filter(req => req.url?.includes('/auth/refresh'))).toHaveLength(1);
    });

    it('does not start another refresh when queued retries also return 401', async () => {
      useAuthStore.setState({
        status: 'signIn',
        token: { access: 'expired-access-token', refresh: 'valid-refresh-token' },
      });

      mock.onGet('/protected-1').reply(401);
      mock.onGet('/protected-2').reply(401);
      mock.onGet('/protected-3').reply(401);
      axiosMock.onPost(`${Env.EXPO_PUBLIC_API_URL}/auth/refresh`).replyOnce(200, {
        access: 'still-invalid-access-token',
        refresh: 'new-refresh-token',
      });

      const results = await Promise.allSettled([
        client.get('/protected-1'),
        client.get('/protected-2'),
        client.get('/protected-3'),
      ]);

      expect(results.every(result => result.status === 'rejected')).toBe(true);
      expect(axiosMock.history.post.filter(req => req.url?.includes('/auth/refresh'))).toHaveLength(1);
    });

    it('passes through non-401 errors without refresh', async () => {
      useAuthStore.setState({
        status: 'signIn',
        token: { access: 'valid-access-token', refresh: 'valid-refresh-token' },
      });

      mock.onGet('/server-error').replyOnce(500, { error: 'Internal Server Error' });

      await expect(client.get('/server-error')).rejects.toThrow();

      expect(mock.history.post).toHaveLength(0); // No refresh attempted
      expect(useAuthStore.getState()).toMatchObject({ status: 'signIn' });
    });

    it('falls back to direct removal when sign-out storage cleanup fails', async () => {
      useAuthStore.setState({
        status: 'signIn',
        token: { access: 'expired-access-token', refresh: 'invalid-refresh-token' },
      });
      mockRemoveToken.mockRejectedValueOnce(new Error('Secure storage unavailable'));

      mock.onGet('/protected').replyOnce(401);
      axiosMock.onPost(`${Env.EXPO_PUBLIC_API_URL}/auth/refresh`).replyOnce(401);

      await expect(client.get('/protected')).rejects.toThrow();

      // signOut's removal attempt fails, then the client retries removal once.
      expect(mockRemoveToken).toHaveBeenCalledTimes(2);
      expect(useAuthStore.getState()).toMatchObject({ status: 'signOut', token: null });
    });
  });
  it.each([200, 401])('discards an old account refresh returning %s after account switch', async (status) => {
    const a = { access: 'account-a', refresh: 'refresh-a' };
    const b = { access: 'account-b', refresh: 'refresh-b' };
    await signIn(a);
    let complete!: () => void;
    let started!: () => void;
    const refreshing = new Promise<void>((resolve) => {
      started = resolve;
    });
    mock.onGet('/protected').reply(401);
    axiosMock.onPost().reply(() => new Promise((resolve) => {
      complete = () => resolve([status, { access: 'rotated-a', refresh: 'rotated-refresh-a' }]);
      started();
    }));
    const request = client.get('/protected');
    const outcome = request.catch(error => error);
    await refreshing;
    await signOut();
    await signIn(b);
    mockSetToken.mockClear();
    complete();
    expect(await outcome).toBeInstanceOf(Error);
    expect(mockSetToken).not.toHaveBeenCalled();
    expect(useAuthStore.getState()).toMatchObject({ status: 'signIn', token: b });
    expect(mock.history.get).toHaveLength(1);
  });

  it('rejects a successful old response instead of delivering it to the next account', async () => {
    await signIn({ access: 'a', refresh: 'a-refresh' });
    let complete!: () => void;
    let started!: () => void;
    const pending = new Promise<void>((resolve) => {
      started = resolve;
    });
    mock.onGet('/private').reply(() => new Promise((resolve) => {
      complete = () => resolve([200, { private: 'account-a' }]);
      started();
    }));
    const result = client.get('/private').catch(error => error);
    await pending;
    await signIn({ access: 'b', refresh: 'b-refresh' });
    complete();
    expect(await result).toBeInstanceOf(SessionChangedError);
  });

  it('revokes memory when both credential deletion attempts fail', async () => {
    await signIn({ access: 'expired', refresh: 'invalid' });
    mockRemoveToken.mockRejectedValue(new Error('Storage unavailable'));
    mock.onGet('/private').reply(401);
    axiosMock.onPost().reply(401);
    await expect(client.get('/private')).rejects.toThrow();
    expect(mockRemoveToken).toHaveBeenCalledTimes(2);
    expect(useAuthStore.getState()).toMatchObject({ status: 'signOut', token: null });
  });
});
