import type { GenericAbortSignal } from 'axios';

import Env from 'env';
import { z } from 'zod';

import { client } from '@/lib/api/client';
import { assertSession, useAuthStore } from '@/lib/auth/session-store';

const postSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  body: z.string(),
});
const pageSchema = z.object({
  posts: z.array(postSchema),
  total: z.number().nonnegative(),
  skip: z.number().nonnegative(),
  limit: z.number().nonnegative(),
});

export type Post = z.infer<typeof postSchema>;
export type PostInput = Omit<Post, 'id'>;
export type PostsPage = z.infer<typeof pageSchema>;
export const PAGE_SIZE = 20;

export const isDemoFeed = Env.EXPO_PUBLIC_APP_ENV !== 'production'
  && new URL(Env.EXPO_PUBLIC_API_URL).hostname === 'dummyjson.com';

// Demo writes live for this session, independently of query garbage collection.
// Negative IDs cannot collide with the remote sample's positive IDs.
const demoPosts = new Map<number, Post>();
let nextDemoId = -1;
useAuthStore.subscribe((state, previous) => {
  if (state.sessionId !== previous.sessionId) {
    demoPosts.clear();
    nextDemoId = -1;
  }
});

type ReadContext = { sessionId: number; signal?: GenericAbortSignal };

export const postsSource = {
  async list(skip: number, context: ReadContext): Promise<PostsPage> {
    assertSession(context.sessionId);
    const { data } = await client.get('posts', {
      params: { skip, limit: PAGE_SIZE },
      signal: context.signal,
    });
    assertSession(context.sessionId);
    const page = pageSchema.parse(data);
    return {
      ...page,
      // Pagination counts only remote rows. Local additions never change the
      // remote offset, including when a post is created between page requests.
      posts: isDemoFeed && skip === 0
        ? [...demoPosts.values()].reverse().concat(page.posts)
        : page.posts,
    };
  },
  async get(id: string, context: ReadContext): Promise<Post> {
    assertSession(context.sessionId);
    const local = isDemoFeed ? demoPosts.get(Number(id)) : undefined;
    if (local) {
      return local;
    }
    const { data } = await client.get(`posts/${encodeURIComponent(id)}`, { signal: context.signal });
    assertSession(context.sessionId);
    return postSchema.parse(data);
  },
  async create(input: PostInput, sessionId: number): Promise<Post> {
    assertSession(sessionId);
    if (isDemoFeed) {
      const post = postSchema.parse({ ...input, id: nextDemoId-- });
      demoPosts.set(post.id, post);
      return post;
    }
    const { data } = await client.post('posts/add', input);
    assertSession(sessionId);
    return postSchema.parse(data);
  },
};
