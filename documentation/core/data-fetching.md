# Data Fetching

**Applies to:** feature-owned API modules. The token lifecycle and refresh
contract are owned by [Authentication](./authentication.md).

## Shared infrastructure

[`src/lib/api/`](../../src/lib/api/) provides the Axios client, React Query
client, provider, and pagination helpers. The API base URL comes from
`Env.EXPO_PUBLIC_API_URL`; requests time out after 15 seconds, queries remain
fresh for 30 seconds and retry twice, and mutations do not retry automatically.
`APIProvider` is mounted by the root layout.

Development defaults to DummyJSON so the Feed example works after initial
setup. Production configuration rejects that endpoint and requires a
project-owned HTTPS API URL.

## Feature API modules

Each feature owns an `api.ts` file for request types and React Query Kit hooks.
The Feed example exposes `usePosts`, `usePost`, and `useAddPost`.

```ts
export const usePosts = createQuery({
  queryKey: ['posts'],
  fetcher: () => client.get('posts').then(response => response.data.posts),
});
```

Keep response and variable types close to each hook. Screens should consume
loading, error, and data state instead of embedding request logic.

## Mutations and testing

Use `createMutation` for writes. On success, give user feedback, navigate with
the shared helper, and invalidate or update affected queries.

Use `axios-mock-adapter` for feature API tests. Reference tests live beside the
client, pagination helpers, and Feed hooks. See [Testing](../quality/testing.md)
for repository-wide test strategy.

## Error handling conventions

Queries and mutations fail differently, and the template treats them
differently:

- **Query errors** (reads) render inline error state in the screen, following
the `FeedState` pattern in `src/features/feed/feed-screen.tsx`: a short message
plus a retry affordance. Do not pair a failed query with a global toast; the
screen already communicates the failure.
- **Mutation errors** (writes) surface through `showErrorToast` from
`src/lib/toast.ts` (reference: `add-post-screen`), because a failed write often
happens after the user has left the form context behind.

`showErrorToast` converts any error to a user-readable message via
`getApiErrorMessage` in `src/lib/api/errors.ts`.

## Default query strategy

`APIProvider` owns one shared `QueryClient`. Feature hooks inherit these
defaults and may override them per hook:

| Option | Default | Why |
| --- | --- | --- |
| `retry` (queries) | 2 | Transient network failures self-heal. |
| `retry` (mutations) | false | Writes must not replay automatically. |
| `staleTime` | 30 s | Keep lists fresh without refetching on every mount. |
| `gcTime` | 5 min | Back-navigation reuses cached data instead of refetching. |
| `refetchOnWindowFocus` | false | RN AppState changes are noisy; do not refetch on focus. |
| `refetchOnReconnect` | true | Recover automatically when connectivity returns. |
| `timeout` (axios) | 15 s | The API client aborts stalled requests. |

Per-hook overrides belong next to the hook that needs them, e.g.
`{ staleTime: 60_000 }` passed to `createQuery`.
