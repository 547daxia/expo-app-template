# Data Fetching

## Shared infrastructure

[`src/lib/api/`](../src/lib/api/) provides the Axios client, React Query client,
provider, and shared query utilities. The Axios base URL comes from
`Env.EXPO_PUBLIC_API_URL`, requests time out after 15 seconds, queries remain
fresh for 30 seconds and retry twice, and mutations do not retry automatically.
`APIProvider` is mounted by the root layout.

Development defaults to DummyJSON so the feed works after the initial setup.
Production validation rejects this demo endpoint and requires a project-owned
HTTPS API URL.

## Feature API modules

Each feature owns an `api.ts` file for its request types and React Query Kit hooks. The feed example defines:

- `usePosts` for the collection query
- `usePost` for a post detail query
- `useAddPost` for creating a post

```ts
export const usePosts = createQuery({
  queryKey: ['posts'],
  fetcher: () => client.get('posts').then(response => response.data.posts),
});
```

Keep response and variable types close to the hook. Screens should consume loading, error, and data state rather than embedding request logic.

## Mutations and invalidation

Use `createMutation` for writes. On success, show user feedback with `react-native-flash-message`, navigate with the navigation helper, and invalidate or update affected queries when the server response changes cached data.

React Query devtools are available through the Expo dev tools menu while the development server is running.
