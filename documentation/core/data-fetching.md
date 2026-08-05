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
