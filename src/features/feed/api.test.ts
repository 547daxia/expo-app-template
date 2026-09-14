import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { client } from '@/lib/api/client';
import { queryClient } from '@/lib/api/query-client';
import { signIn, signOut, useAuthStore } from '@/lib/auth/session-store';
import { nextPostsPage, useAddPost, usePost, usePosts } from './api';
import { PAGE_SIZE } from './data-source';

jest.mock('@/lib/auth/utils', () => ({
  getToken: jest.fn().mockResolvedValue(null),
  setToken: jest.fn().mockResolvedValue(undefined),
  removeToken: jest.fn().mockResolvedValue(undefined),
}));

const remotePost = { id: 1, userId: 1, title: 'Remote post', body: 'Remote body' };
const input = { userId: 1, title: 'Created post', body: 'Created body' };
let mock: MockAdapter;
let sessionId: number;

beforeEach(async () => {
  mock = new MockAdapter(client);
  await signIn({ access: 'demo', refresh: 'demo-refresh' });
  sessionId = useAuthStore.getState().sessionId;
});

afterEach(() => {
  mock.restore();
  queryClient.clear();
});

it('fetches successive pages and stops at the total', async () => {
  mock.onGet('posts').reply(config => [200, {
    posts: [remotePost],
    skip: config.params.skip,
    limit: PAGE_SIZE,
    total: 25,
  }]);
  const first = await usePosts.fetcher({ sessionId }, { pageParam: 0 });
  const next = nextPostsPage(first);
  const last = await usePosts.fetcher({ sessionId }, { pageParam: next });

  expect(mock.history.get.map(request => request.params)).toEqual([
    { skip: 0, limit: PAGE_SIZE },
    { skip: PAGE_SIZE, limit: PAGE_SIZE },
  ]);
  expect(nextPostsPage(last)).toBeUndefined();
});

it('keeps new demo posts available in the list and detail after cache eviction and refetch', async () => {
  mock.onGet('posts').reply(200, { posts: [remotePost], skip: 0, limit: PAGE_SIZE, total: 1 });
  const first = await useAddPost.mutationFn({ input, sessionId });
  const second = await useAddPost.mutationFn({ input, sessionId });
  expect(first.id).not.toBe(second.id);
  queryClient.clear();

  const page = await usePosts.fetcher({ sessionId }, { pageParam: 0 });
  expect(page.posts).toEqual([second, first, remotePost]);
  expect(nextPostsPage(page)).toBeUndefined();
  const detail = await usePost.fetcher({ id: String(first.id), sessionId });
  expect(detail).toEqual(first);
  expect(mock.history.post).toHaveLength(0);
  expect(mock.history.get.every(request => request.url === 'posts')).toBe(true);
});

it('seeds created detail and updates the existing paginated list', async () => {
  queryClient.setQueryData(usePosts.getKey({ sessionId }), {
    pages: [{ posts: [remotePost], total: 1, skip: 0, limit: PAGE_SIZE }],
    pageParams: [0],
  });
  const post = await useAddPost.mutationFn({ input, sessionId });
  expect(queryClient.getQueryData(usePost.getKey({ id: String(post.id), sessionId }))).toEqual(post);
  expect(queryClient.getQueryData(usePosts.getKey({ sessionId }))).toMatchObject({
    pages: [{ posts: [post, remotePost] }],
  });
});

it('discards demo posts and caches across account switches', async () => {
  const post = await useAddPost.mutationFn({ input, sessionId });
  await signOut();
  await signIn({ access: 'next', refresh: 'next-refresh' });
  const nextSession = useAuthStore.getState().sessionId;
  mock.onGet('posts').reply(200, { posts: [remotePost], skip: 0, limit: PAGE_SIZE, total: 1 });
  const page = await usePosts.fetcher({ sessionId: nextSession }, { pageParam: 0 });
  expect(page.posts).toEqual([remotePost]);
  expect(queryClient.getQueryData(usePost.getKey({ id: String(post.id), sessionId }))).toBeUndefined();
  await expect(useAddPost.mutationFn({ input, sessionId })).rejects.toThrow('session changed');
});

it('passes cancellation to the transport', async () => {
  const controller = new AbortController();
  let started!: () => void;
  let complete!: () => void;
  const pending = new Promise<void>((resolve) => {
    started = resolve;
  });
  mock.onGet('posts').reply(() => new Promise((resolve) => {
    complete = () => resolve([200, { posts: [], skip: 0, limit: PAGE_SIZE, total: 0 }]);
    started();
  }));
  const result = Promise.resolve(usePosts.fetcher({ sessionId }, { pageParam: 0, signal: controller.signal }))
    .catch(error => error);
  await pending;
  controller.abort();
  complete();
  expect(axios.isCancel(await result)).toBe(true);
  expect(mock.history.get[0]?.signal).toBe(controller.signal);
});

it('rejects malformed responses and preserves HTTP errors', async () => {
  mock.onGet('posts').replyOnce(200, { posts: 'invalid' });
  await expect(usePosts.fetcher({ sessionId }, { pageParam: 0 })).rejects.toThrow();
  mock.onGet('posts/999').reply(404);
  await expect(usePost.fetcher({ id: '999', sessionId })).rejects.toThrow();
});

// Prevent cache-GC timers from outliving the test; cache is cleared explicitly.
beforeAll(() => queryClient.setDefaultOptions({
  queries: { retry: false, gcTime: Infinity },
  mutations: { retry: false, gcTime: Infinity },
}));
