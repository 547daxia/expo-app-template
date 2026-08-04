import * as SecureStore from 'expo-secure-store';

import { getTokenValue, removeTokenValue, setTokenValue } from './token-storage';

jest.mock('expo-secure-store', () => ({
  deleteItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}));

const mockDeleteItemAsync = jest.mocked(SecureStore.deleteItemAsync);
const mockGetItemAsync = jest.mocked(SecureStore.getItemAsync);
const mockSetItemAsync = jest.mocked(SecureStore.setItemAsync);

describe('native auth token storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('reads the token from SecureStore', async () => {
    mockGetItemAsync.mockResolvedValue('stored-token');

    await expect(getTokenValue()).resolves.toBe('stored-token');
    expect(mockGetItemAsync).toHaveBeenCalledWith('auth-token');
  });

  it('writes the token to SecureStore', async () => {
    mockSetItemAsync.mockResolvedValue();

    await setTokenValue('stored-token');
    expect(mockSetItemAsync).toHaveBeenCalledWith('auth-token', 'stored-token');
  });

  it('removes the token from SecureStore', async () => {
    mockDeleteItemAsync.mockResolvedValue();

    await removeTokenValue();
    expect(mockDeleteItemAsync).toHaveBeenCalledWith('auth-token');
  });
});
