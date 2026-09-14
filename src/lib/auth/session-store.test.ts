import { hydrateAuth, SessionChangedError, signIn, signOut, useAuthStore } from './session-store';
import { getToken, removeToken, setToken } from './utils';

jest.mock('./utils');

const mockGetToken = jest.mocked(getToken);
const mockRemoveToken = jest.mocked(removeToken);
const mockSetToken = jest.mocked(setToken);

describe('session store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ status: 'idle', token: null });
    mockGetToken.mockResolvedValue(null);
    mockRemoveToken.mockResolvedValue();
    mockSetToken.mockResolvedValue();
  });

  afterEach(() => {
    jest.useRealTimers();
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
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.useFakeTimers();
    let finishRead!: (token: null) => void;
    mockGetToken.mockImplementation(() => new Promise((resolve) => {
      finishRead = resolve;
    }));

    const hydration = hydrateAuth();
    await jest.advanceTimersByTimeAsync(10_000);
    await hydration;

    expect(useAuthStore.getState()).toMatchObject({ status: 'signOut', token: null });
    expect(consoleError).toHaveBeenCalledTimes(1);
    finishRead(null);
    await Promise.resolve();
  });

  it('updates signed-in state only after the token is stored', async () => {
    const token = { access: 'access-token', refresh: 'refresh-token' };

    await signIn(token);

    expect(mockSetToken).toHaveBeenCalledWith(token);
    expect(useAuthStore.getState()).toMatchObject({ status: 'signIn', token });
  });

  it('persists a refreshed token and keeps the session signed in', async () => {
    const rotated = { access: 'new-access-token', refresh: 'new-refresh-token' };
    useAuthStore.setState({
      status: 'signIn',
      token: { access: 'old-access-token', refresh: 'old-refresh-token' },
    });

    await useAuthStore.getState().refreshToken(rotated, useAuthStore.getState().sessionId);

    expect(mockSetToken).toHaveBeenCalledWith(rotated);
    expect(useAuthStore.getState()).toMatchObject({ status: 'signIn', token: rotated });
  });

  it('clears the session when signing out', async () => {
    useAuthStore.setState({
      status: 'signIn',
      token: { access: 'access-token', refresh: 'refresh-token' },
    });

    await signOut();

    expect(mockRemoveToken).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState()).toMatchObject({ status: 'signOut', token: null });
  });

  it('revokes the session even when its persisted token cannot be removed', async () => {
    useAuthStore.setState({
      status: 'signIn',
      token: { access: 'access-token', refresh: 'refresh-token' },
    });
    mockRemoveToken.mockRejectedValue(new Error('Secure storage unavailable'));

    await expect(signOut()).rejects.toThrow('Secure storage unavailable');
    expect(useAuthStore.getState()).toMatchObject({ status: 'signOut', token: null });
  });
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe('session concurrency', () => {
  const tokenA = { access: 'account-a', refresh: 'refresh-a' };
  const tokenB = { access: 'account-b', refresh: 'refresh-b' };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetToken.mockResolvedValue(null);
    mockSetToken.mockResolvedValue();
    mockRemoveToken.mockResolvedValue();
    useAuthStore.setState({ status: 'idle', token: null });
  });

  it('does not allow an old refresh to overwrite a new account', async () => {
    await signIn(tokenA);
    const oldSession = useAuthStore.getState().sessionId;
    await signOut();
    await signIn(tokenB);
    mockSetToken.mockClear();

    await expect(useAuthStore.getState().refreshToken(tokenA, oldSession))
      .rejects
      .toBeInstanceOf(SessionChangedError);

    expect(mockSetToken).not.toHaveBeenCalled();
    expect(useAuthStore.getState().token).toEqual(tokenB);
  });

  it('serializes an in-flight refresh write before logout and the next login', async () => {
    await signIn(tokenA);
    const writing = deferred<void>();
    const started = deferred<void>();
    mockSetToken.mockImplementationOnce(() => {
      started.resolve();
      return writing.promise;
    });
    const refresh = useAuthStore.getState().refreshToken(tokenA, useAuthStore.getState().sessionId);
    const rejected = expect(refresh).rejects.toBeInstanceOf(SessionChangedError);
    await started.promise;
    const logout = signOut();
    expect(useAuthStore.getState()).toMatchObject({ status: 'signOut', token: null });
    const login = signIn(tokenB);
    writing.resolve();
    await Promise.all([rejected, logout, login]);

    expect(mockRemoveToken).toHaveBeenCalledTimes(1);
    expect(mockSetToken).toHaveBeenLastCalledWith(tokenB);
    expect(useAuthStore.getState()).toMatchObject({ status: 'signIn', token: tokenB });
  });

  it('discards hydration when sign-in begins during the read', async () => {
    const read = deferred<typeof tokenA>();
    mockGetToken.mockReturnValueOnce(read.promise);
    const restoring = hydrateAuth();
    const login = signIn(tokenB);
    read.resolve(tokenA);
    await Promise.all([restoring, login]);

    expect(useAuthStore.getState()).toMatchObject({ status: 'signIn', token: tokenB });
  });

  it('shares one hydration read between simultaneous callers', async () => {
    await Promise.all([hydrateAuth(), hydrateAuth()]);
    expect(mockGetToken).toHaveBeenCalledTimes(1);
  });
});
