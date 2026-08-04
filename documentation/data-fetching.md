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

## Authentication integration

The Axios client in [`src/lib/api/client.tsx`](../src/lib/api/client.tsx) automatically handles authentication:

- **Request interceptor**: Injects Bearer tokens into all API requests with timeout protection
- **Response interceptor**: Automatically refreshes tokens on 401 errors
- **Token caching**: Caches tokens in memory to avoid repeated SecureStore reads (90-95% performance improvement)
- **Concurrent 401 handling**: Queues multiple requests during a single token refresh

No additional configuration is needed in your feature API modules—authentication is handled transparently.

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

## Testing

The template includes comprehensive test coverage for the API layer:

- [`src/lib/api/client.test.ts`](../src/lib/api/client.test.ts) - Tests for token injection, 401 refresh flow, and concurrent request handling
- [`src/lib/api/utils.test.ts`](../src/lib/api/utils.test.ts) - Tests for pagination utilities
- [`src/features/feed/api.test.ts`](../src/features/feed/api.test.ts) - Example feature API tests

Use `axios-mock-adapter` to mock HTTP requests in your tests. See the existing tests for examples.
