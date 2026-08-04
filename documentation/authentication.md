# Authentication

## Current flow

Authentication state is owned by [`src/features/auth/use-auth-store.tsx`](../src/features/auth/use-auth-store.tsx). The store exposes `idle`, `signOut`, and `signIn` states plus `signIn`, `signOut`, and `hydrate` actions.

The root layout calls asynchronous `hydrateAuth()` while retaining the native
splash screen. The route tree mounts only after hydration resolves. A missing or
malformed token produces signed-out state, and a storage failure also fails
closed to signed-out state. In development and preview, login accepts any valid
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

## Replacing the demo

When integrating a backend:

- Replace the mock login handler with a real mutation.
- Define the backend token shape in `TokenType`.
- Add Axios request/refresh handling in `src/lib/api/client.tsx` or a dedicated auth layer.
- Revoke and clear local state on logout or refresh failure.
- Cover signed-out, signed-in, expired-token, and failed-login paths with tests.
