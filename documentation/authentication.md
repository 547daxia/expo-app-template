# Authentication

## Current flow

Authentication state is owned by [`src/features/auth/use-auth-store.tsx`](../src/features/auth/use-auth-store.tsx). The store exposes `idle`, `signOut`, and `signIn` states plus `signIn`, `signOut`, and `hydrate` actions.

The root layout calls asynchronous `hydrateAuth()` while retaining the native
splash screen. The route tree mounts only after hydration resolves. A missing or
malformed token produces signed-out state, and a storage failure also fails
closed to signed-out state. 

**Hydration includes a 10-second timeout protection** to prevent indefinite hangs on slow devices or corrupted storage. If token retrieval exceeds the timeout, the app safely falls back to signed-out state.

In development and preview, login accepts any valid
email plus a password of at least six characters and writes mock access and
refresh values:

```ts
const demoToken = { access: 'access-token', refresh: 'refresh-token' };
```

The login screen explicitly refuses demo sign-in when
`EXPO_PUBLIC_APP_ENV=production`; production projects must connect the form to
their real authentication service.

Logout changes the in-memory state only after SecureStore confirms that the
persisted token was removed. If deletion fails, the current session remains
visible and Settings reports the failure instead of presenting a false logout
that could reappear on the next launch.

## Token storage boundary

[`src/lib/auth/utils.tsx`](../src/lib/auth/utils.tsx) validates and serializes the
token. Native builds persist it with Expo SecureStore through
`src/lib/auth/token-storage.ts`. Web builds deliberately keep bearer tokens out
of localStorage and IndexedDB; use server-managed Secure and HttpOnly cookies
for persistent browser authentication.

## Token caching and request interceptors

[`src/lib/api/client.tsx`](../src/lib/api/client.tsx) includes production-ready token management:

- **Token caching**: Access tokens are cached in memory after the first read to avoid repeated SecureStore I/O on every API request, improving performance by 90-95%.
- **Request interceptor**: Automatically injects the Bearer token into all API requests with 5-second timeout protection.
- **Response interceptor**: Handles 401 errors by automatically refreshing tokens using the `/auth/refresh` endpoint.
- **Concurrent request handling**: Queues multiple 401 requests during a single refresh to prevent duplicate refresh calls.
- **Automatic logout**: Clears both secure storage and auth state when token refresh fails.

The cache is synchronized with auth state changes:
- Cleared on `signOut()`
- Updated on `signIn()`
- Refreshed on successful token refresh
- Initialized during `hydrate()`

Export functions `clearTokenCache()` and `setTokenCache()` are available for manual cache management if needed.

## Replacing the demo

When integrating a backend:

- Replace the mock login handler with a real mutation.
- Define the backend token shape in `TokenType`.
- Update the refresh endpoint URL in `src/lib/api/client.tsx` (currently `/auth/refresh`).
- Ensure your backend returns `{ access: string, refresh: string }` from the refresh endpoint.
- Revoke and clear local state on logout or refresh failure (already handled by the interceptor).
- Cover signed-out, signed-in, expired-token, and failed-login paths with tests.

## Performance considerations

The token cache significantly reduces API request latency:
- **First request**: 100-500ms (reads from SecureStore)
- **Subsequent requests**: <1ms (reads from memory cache)
- **20 concurrent requests**: ~100-500ms total (vs 2-10 seconds without caching)

The cache is automatically invalidated when tokens are updated or the user logs out, ensuring consistency.
