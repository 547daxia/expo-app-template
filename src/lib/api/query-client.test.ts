import { signIn, signOut, useAuthStore } from '@/lib/auth/session-store';
import { queryClient } from './query-client';

jest.mock('@/lib/auth/utils', () => ({
  getToken: jest.fn().mockResolvedValue(null),
  setToken: jest.fn().mockResolvedValue(undefined),
  removeToken: jest.fn().mockResolvedValue(undefined),
}));

afterEach(() => queryClient.clear());

it('clears account data and aborts active queries on logout', async () => {
  await signIn({ access: 'account-a', refresh: 'refresh-a' });
  const sessionId = useAuthStore.getState().sessionId;
  queryClient.setQueryData(['profile', sessionId], { name: 'Account A' });
  let signal!: AbortSignal;
  const pending = queryClient.fetchQuery({
    queryKey: ['private', sessionId],
    queryFn: context => new Promise((_resolve, reject) => {
      signal = context.signal;
      signal.addEventListener('abort', () => reject(new Error('Aborted')));
    }),
  }).catch(error => error);

  await signOut();
  await pending;
  expect(signal.aborted).toBe(true);
  expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
  await signIn({ access: 'account-b', refresh: 'refresh-b' });
  expect(queryClient.getQueryData(['profile', sessionId])).toBeUndefined();
});

// Prevent cache-GC timers from outliving the test; cache is cleared explicitly.
beforeAll(() => queryClient.setDefaultOptions({
  queries: { retry: false, gcTime: Infinity },
  mutations: { retry: false, gcTime: Infinity },
}));
