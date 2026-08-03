import { storage } from '@/lib/storage';
import { getToken } from './utils';

describe('auth token storage', () => {
  beforeEach(() => {
    storage.clearAll();
  });

  it('rejects malformed persisted token values', () => {
    storage.set('token', 'not-a-token');

    expect(getToken()).toBeNull();
  });

  it('accepts a token with the required fields', () => {
    storage.set('token', JSON.stringify({
      access: 'access-token',
      refresh: 'refresh-token',
    }));

    expect(getToken()).toEqual({
      access: 'access-token',
      refresh: 'refresh-token',
    });
  });
});
