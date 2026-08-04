import { getTokenValue, removeTokenValue, setTokenValue } from './token-storage.web';

describe('web auth token storage', () => {
  it('does not persist bearer tokens in browser-readable storage', async () => {
    await setTokenValue('access-token');

    await expect(getTokenValue()).resolves.toBeNull();
  });

  it('allows sign-out cleanup to remain platform-independent', async () => {
    await expect(removeTokenValue()).resolves.toBeUndefined();
  });
});
