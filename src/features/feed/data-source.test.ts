import MockAdapter from 'axios-mock-adapter';

import { client } from '@/lib/api/client';
import { queryClient } from '@/lib/api/query-client';
import { signIn, useAuthStore } from '@/lib/auth/session-store';
import { useAddPost, usePost } from './api';

jest.mock('env', () => ({
  __esModule: true,
  default: { EXPO_PUBLIC_APP_ENV: 'production', EXPO_PUBLIC_API_URL: 'https://api.owned.test' },
}));
jest.mock('@/lib/auth/utils', () => ({
  getToken: jest.fn().mockResolvedValue(null),
  setToken: jest.fn().mockResolvedValue(undefined),
  removeToken: jest.fn().mockResolvedValue(undefined),
}));

let mock: MockAdapter;
beforeEach(async () => {
  mock = new MockAdapter(client);
  await signIn({ access: 'real', refresh: 'real-refresh' });
});
afterEach(() => {
  mock.restore();
  queryClient.clear();
});

it('uses the configured backend for production writes and detail reads', async () => {
  const sessionId = useAuthStore.getState().sessionId;
  const input = { title: 'Real post', body: 'Real content', userId: 7 };
  mock.onPost('posts/add', input).reply(201, { ...input, id: 123 });
  const post = await useAddPost.mutationFn({ input, sessionId });
  mock.onGet('posts/123').reply(200, post);
  expect(await usePost.fetcher({ id: '123', sessionId })).toEqual(post);
  expect(mock.history.post).toHaveLength(1);
  expect(mock.history.get).toHaveLength(1);
});

it('does not let a late creation response repopulate a new account cache', async () => {
  const sessionId = useAuthStore.getState().sessionId;
  let started!: () => void;
  let complete!: () => void;
  const pending = new Promise<void>((resolve) => {
    started = resolve;
  });
  const input = { title: 'Old account post', body: 'Private content', userId: 7 };
  mock.onPost('posts/add').reply(() => new Promise((resolve) => {
    complete = () => resolve([201, { ...input, id: 123 }]);
    started();
  }));
  const result = useAddPost.mutationFn({ input, sessionId }).catch(error => error);
  await pending;
  await signIn({ access: 'next-account', refresh: 'next-refresh' });
  complete();
  expect(await result).toBeInstanceOf(Error);
  expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
});

// Prevent cache-GC timers from outliving the test; cache is cleared explicitly.
beforeAll(() => queryClient.setDefaultOptions({
  queries: { retry: false, gcTime: Infinity },
  mutations: { retry: false, gcTime: Infinity },
}));
