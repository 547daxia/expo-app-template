import type { InfiniteData } from '@tanstack/react-query';

import type { PostInput, PostsPage } from './data-source';

import { createInfiniteQuery, createMutation, createQuery } from 'react-query-kit';
import { queryClient } from '@/lib/api/query-client';
import { assertSession } from '@/lib/auth/session-store';
import { postsSource } from './data-source';

export type { Post } from './data-source';

type SessionVariables = { sessionId: number };

export function nextPostsPage(page: PostsPage) {
  const next = page.skip + page.limit;
  return page.limit > 0 && next < page.total ? next : undefined;
}

export const usePosts = createInfiniteQuery({
  queryKey: ['posts', 'list'],
  initialPageParam: 0,
  fetcher: (variables: SessionVariables, context) => postsSource.list(context.pageParam, {
    sessionId: variables.sessionId,
    signal: context.signal,
  }),
  getNextPageParam: nextPostsPage,
});

export const usePost = createQuery({
  queryKey: ['posts', 'detail'],
  fetcher: (variables: SessionVariables & { id: string }, context) => postsSource.get(variables.id, {
    sessionId: variables.sessionId,
    signal: context?.signal,
  }),
});

export const useAddPost = createMutation({
  mutationFn: async ({ input, sessionId }: SessionVariables & { input: PostInput }) => {
    const post = await postsSource.create(input, sessionId);
    assertSession(sessionId);
    // Cancel older reads before changing cache so they cannot overwrite the
    // newly created row. The data source retains demo writes across refetches.
    await queryClient.cancelQueries({ queryKey: usePosts.getKey({ sessionId }) });
    assertSession(sessionId);
    queryClient.setQueryData(usePost.getKey({ id: String(post.id), sessionId }), post);
    queryClient.setQueryData(usePosts.getKey({ sessionId }), (data: InfiniteData<PostsPage, number> | undefined) => {
      if (!data) {
        return data;
      }
      return {
        ...data,
        pages: data.pages.map((page, index) => index === 0
          ? { ...page, posts: [post, ...page.posts.filter(item => item.id !== post.id)] }
          : page),
      };
    });
    return post;
  },
});
