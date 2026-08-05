import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Env from 'env';

import { signOut } from '@/features/auth/use-auth-store';
import { getToken, removeToken, setToken } from '@/lib/auth/utils';

import { clearTokenCache, client, setTokenCache } from './client';

jest.mock('@/lib/auth/utils');
jest.mock('@/features/auth/use-auth-store', () => ({
  signOut: jest.fn(),
}));

const mockGetToken = jest.mocked(getToken);
const mockSetToken = jest.mocked(setToken);
const mockRemoveToken = jest.mocked(removeToken);
const mockSignOut = jest.mocked(signOut);

/* eslint-disable max-lines-per-function */
describe('aPI client interceptors', () => {
  let mock: MockAdapter;
  let axiosMock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(client);
    axiosMock = new MockAdapter(axios);
    jest.clearAllMocks();
    clearTokenCache(); // Clear token cache before each test
    mockGetToken.mockResolvedValue(null);
    mockSetToken.mockResolvedValue();
    mockRemoveToken.mockResolvedValue();
    mockSignOut.mockResolvedValue();
  });

  afterEach(() => {
    jest.useRealTimers();
    mock.restore();
    axiosMock.restore();
  });

  describe('request interceptor: token injection', () => {
    it('injects Bearer token when token exists', async () => {
      mockGetToken.mockResolvedValue({
        access: 'test-access-token',
        refresh: 'test-refresh-token',
      });

      mock.onGet('/test').reply((config) => {
        expect(config.headers?.Authorization).toBe('Bearer test-access-token');
        return [200, { data: 'success' }];
      });

      await client.get('/test');

      expect(mockGetToken).toHaveBeenCalledTimes(1);
    });

    it('does not inject Authorization header when token is null', async () => {
      mockGetToken.mockResolvedValue(null);

      mock.onGet('/test').reply((config) => {
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, { data: 'success' }];
      });

      await client.get('/test');

      expect(mockGetToken).toHaveBeenCalledTimes(1);
    });

    it('does not retain a timeout when the token is cached', async () => {
      jest.useFakeTimers();
      setTokenCache({ access: 'cached-access-token', refresh: 'cached-refresh-token' });
      mock.onGet('/test').reply(200, { data: 'success' });

      await client.get('/test');

      expect(jest.getTimerCount()).toBe(0);
    });
  });

  describe('response interceptor: 401 refresh', () => {
    it('refreshes token and retries request on 401', async () => {
      mockGetToken
        .mockResolvedValueOnce({
          access: 'expired-access-token',
          refresh: 'valid-refresh-token',
        })
        .mockResolvedValueOnce({
          access: 'expired-access-token',
          refresh: 'valid-refresh-token',
        });

      // First request fails with 401
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
    });

    it('handles missing refresh token', async () => {
      // First request uses cached token (or gets it fresh)
      mockGetToken.mockResolvedValue({
        access: 'expired-access-token',
        refresh: 'valid-refresh-token',
      });

      mock.onGet('/protected').replyOnce(401);

      // During refresh, token is read again and this time it's missing
      mockGetToken.mockResolvedValue(null);

      await expect(client.get('/protected')).rejects.toThrow();
    });

    it('handles token refresh failure', async () => {
      mockGetToken
        .mockResolvedValueOnce({
          access: 'expired-access-token',
          refresh: 'invalid-refresh-token',
        })
        .mockResolvedValueOnce({
          access: 'expired-access-token',
          refresh: 'invalid-refresh-token',
        });

      mock.onGet('/protected').replyOnce(401);
      axiosMock.onPost(`${Env.EXPO_PUBLIC_API_URL}/auth/refresh`).replyOnce(401);

      await expect(client.get('/protected')).rejects.toThrow();
    });

    it('queues concurrent 401 requests to share a single refresh', async () => {
      mockGetToken.mockResolvedValue({
        access: 'expired-access-token',
        refresh: 'valid-refresh-token',
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
      expect(mockSetToken).toHaveBeenCalledTimes(1);
    });

    it('does not retry when refresh endpoint itself returns 401', async () => {
      mockGetToken.mockResolvedValue({
        access: 'expired-access-token',
        refresh: 'valid-refresh-token',
      });

      mock.onGet('/protected').replyOnce(401);
      axiosMock.onPost(`${Env.EXPO_PUBLIC_API_URL}/auth/refresh`).reply(401);

      await expect(client.get('/protected')).rejects.toThrow();

      // Should only attempt refresh once, not infinite loop
      expect(axiosMock.history.post.filter(req => req.url?.includes('/auth/refresh'))).toHaveLength(1);
    });

    it('does not start another refresh when queued retries also return 401', async () => {
      mockGetToken.mockResolvedValue({
        access: 'expired-access-token',
        refresh: 'valid-refresh-token',
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
      mockGetToken.mockResolvedValue({
        access: 'valid-access-token',
        refresh: 'valid-refresh-token',
      });

      mock.onGet('/server-error').replyOnce(500, { error: 'Internal Server Error' });

      await expect(client.get('/server-error')).rejects.toThrow();

      expect(mock.history.post).toHaveLength(0); // No refresh attempted
      expect(mockSignOut).not.toHaveBeenCalled();
    });

    it('calls removeToken as fallback when signOut fails', async () => {
      mockGetToken.mockResolvedValue({
        access: 'expired-access-token',
        refresh: 'invalid-refresh-token',
      });

      mock.onGet('/protected').replyOnce(401);
      axiosMock.onPost(`${Env.EXPO_PUBLIC_API_URL}/auth/refresh`).replyOnce(401);
      mockSignOut.mockRejectedValueOnce(new Error('Unable to update auth state'));

      await expect(client.get('/protected')).rejects.toThrow();
      expect(mockRemoveToken).toHaveBeenCalledTimes(1);
    });
  });
});
