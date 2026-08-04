import { getTokenValue, removeTokenValue, setTokenValue } from './token-storage';
import { getToken, removeToken, setToken } from './utils';

jest.mock('./token-storage');

const mockGetTokenValue = jest.mocked(getTokenValue);
const mockRemoveTokenValue = jest.mocked(removeTokenValue);
const mockSetTokenValue = jest.mocked(setTokenValue);

describe('auth token storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetTokenValue.mockResolvedValue(null);
    mockRemoveTokenValue.mockResolvedValue();
    mockSetTokenValue.mockResolvedValue();
  });

  it('rejects and removes malformed persisted token values', async () => {
    mockGetTokenValue.mockResolvedValue('not-json');

    await expect(getToken()).resolves.toBeNull();
    expect(mockRemoveTokenValue).toHaveBeenCalledTimes(1);
  });

  it('accepts a token with the required fields', async () => {
    mockGetTokenValue.mockResolvedValue(JSON.stringify({
      access: 'access-token',
      refresh: 'refresh-token',
    }));

    await expect(getToken()).resolves.toEqual({
      access: 'access-token',
      refresh: 'refresh-token',
    });
    expect(mockRemoveTokenValue).not.toHaveBeenCalled();
  });

  it('serializes validated token values before storing them', async () => {
    await setToken({ access: 'access-token', refresh: 'refresh-token' });

    expect(mockSetTokenValue).toHaveBeenCalledWith(JSON.stringify({
      access: 'access-token',
      refresh: 'refresh-token',
    }));
  });

  it('removes the secure token value', async () => {
    await removeToken();

    expect(mockRemoveTokenValue).toHaveBeenCalledTimes(1);
  });
});
