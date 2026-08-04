import type { Post } from './api';

import MockAdapter from 'axios-mock-adapter';

import { client } from '@/lib/api/client';
import { useAddPost, usePost, usePosts } from './api';

// Mock the api module to avoid loading the provider
jest.mock('@/lib/api', () => ({
  client: require('@/lib/api/client').client,
}));

describe('feed API hooks', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(client);
  });

  afterEach(() => {
    mock.restore();
  });

  describe('usePosts', () => {
    it('has correct configuration', () => {
      const hook = usePosts;

      expect(hook.getKey()).toEqual(['posts']);
      expect(hook.fetcher).toBeDefined();
    });

    it('fetcher calls correct endpoint', async () => {
      const mockPosts: Post[] = [
        { id: 1, userId: 1, title: 'Post 1', body: 'Body 1' },
        { id: 2, userId: 1, title: 'Post 2', body: 'Body 2' },
      ];

      mock.onGet('posts').reply(200, { posts: mockPosts });

      const result = await usePosts.fetcher();

      expect(result).toEqual(mockPosts);
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.get[0]?.url).toBe('posts');
    });

    it('handles fetch error', async () => {
      mock.onGet('posts').reply(500, { error: 'Server error' });

      await expect(usePosts.fetcher()).rejects.toThrow();
    });
  });

  describe('usePost', () => {
    it('has correct configuration', () => {
      const hook = usePost;

      expect(hook.getKey({ id: '1' })).toEqual(['posts', { id: '1' }]);
      expect(hook.fetcher).toBeDefined();
    });

    it('fetcher calls correct endpoint with id', async () => {
      const mockPost: Post = {
        id: 1,
        userId: 1,
        title: 'Test Post',
        body: 'Test Body',
      };

      mock.onGet('posts/1').reply(200, mockPost);

      const result = await usePost.fetcher({ id: '1' });

      expect(result).toEqual(mockPost);
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.get[0]?.url).toBe('posts/1');
    });

    it('handles not found error', async () => {
      mock.onGet('posts/999').reply(404, { error: 'Not found' });

      await expect(usePost.fetcher({ id: '999' })).rejects.toThrow();
    });
  });

  describe('useAddPost', () => {
    it('has correct mutation function', () => {
      const hook = useAddPost;

      expect(hook.mutationFn).toBeDefined();
    });

    it('mutation calls correct endpoint', async () => {
      const newPost = { title: 'New Post', body: 'New Body', userId: 1 };
      const createdPost: Post = { id: 101, ...newPost };

      mock.onPost('posts/add').reply(200, createdPost);

      const result = await useAddPost.mutationFn(newPost);

      expect(result).toEqual(createdPost);
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.post[0]?.url).toBe('posts/add');
      expect(JSON.parse(mock.history.post[0]?.data as string)).toEqual(newPost);
    });

    it('handles creation error', async () => {
      const newPost = { title: 'New Post', body: 'New Body', userId: 1 };

      mock.onPost('posts/add').reply(400, { error: 'Bad request' });

      await expect(useAddPost.mutationFn(newPost)).rejects.toThrow();
    });
  });
});
