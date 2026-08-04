import { clearTokenCache } from '@/lib/api/client';
import { getToken, removeToken, setToken } from '@/lib/auth/utils';
import { hydrateAuth, signIn, signOut, useAuthStore } from './use-auth-store';

jest.mock('@/lib/auth/utils');
jest.mock('@/lib/api/client', () => ({
  ...jest.requireActual('@/lib/api/client'),
  clearTokenCache: jest.fn(),
  setTokenCache: jest.fn(),
}));

const mockGetToken = jest.mocked(getToken);
const mockRemoveToken = jest.mocked(removeToken);
const mockSetToken = jest.mocked(setToken);
const mockClearTokenCache = jest.mocked(clearTokenCache);

describe('authentication store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ status: 'idle', token: null });
    mockGetToken.mockResolvedValue(null);
    mockRemoveToken.mockResolvedValue();
    mockSetToken.mockResolvedValue();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('hydrates a valid secure token without rewriting it', async () => {
    const token = { access: 'access-token', refresh: 'refresh-token' };
    mockGetToken.mockResolvedValue(token);

    await hydrateAuth();

    expect(useAuthStore.getState()).toMatchObject({ status: 'signIn', token });
    expect(mockSetToken).not.toHaveBeenCalled();
  });

  it('fails closed when secure storage cannot be read', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockGetToken.mockRejectedValue(new Error('Secure storage unavailable'));

    await hydrateAuth();

    expect(useAuthStore.getState()).toMatchObject({ status: 'signOut', token: null });
    expect(consoleError).toHaveBeenCalledTimes(1);
  });

  it('times out after 10 seconds if token retrieval is slow', async () => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    // Simulate slow getToken that never resolves
    mockGetToken.mockImplementation(() => new Promise(() => {}));

    await hydrateAuth();

    expect(useAuthStore.getState()).toMatchObject({ status: 'signOut', token: null });
    expect(consoleWarn).toHaveBeenCalledWith('Token hydration timed out after', 10_000, 'ms');
  }, 15000);

  it('updates signed-in state only after the token is stored', async () => {
    const token = { access: 'access-token', refresh: 'refresh-token' };

    await signIn(token);

    expect(mockSetToken).toHaveBeenCalledWith(token);
    expect(useAuthStore.getState()).toMatchObject({ status: 'signIn', token });
  });

  it('clears token cache when signing out', async () => {
    useAuthStore.setState({
      status: 'signIn',
      token: { access: 'access-token', refresh: 'refresh-token' },
    });

    await signOut();

    expect(mockRemoveToken).toHaveBeenCalledTimes(1);
    expect(mockClearTokenCache).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState()).toMatchObject({ status: 'signOut', token: null });
  });

  it('keeps the session active when its persisted token cannot be removed', async () => {
    useAuthStore.setState({
      status: 'signIn',
      token: { access: 'access-token', refresh: 'refresh-token' },
    });
    mockRemoveToken.mockRejectedValue(new Error('Secure storage unavailable'));

    await expect(signOut()).rejects.toThrow('Secure storage unavailable');
    expect(useAuthStore.getState()).toMatchObject({
      status: 'signIn',
      token: { access: 'access-token', refresh: 'refresh-token' },
    });
  });
});
