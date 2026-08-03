# Authentication

## Current flow

Authentication state is owned by [`src/features/auth/use-auth-store.tsx`](../src/features/auth/use-auth-store.tsx). The store exposes `idle`, `signOut`, and `signIn` states plus `signIn`, `signOut`, and `hydrate` actions.

At module startup, `hydrateAuth()` reads the stored token. The authenticated layout then redirects based on the result. Login currently accepts the demo form and writes mock access and refresh values:

```ts
const demoToken = { access: 'access-token', refresh: 'refresh-token' };
```

This is template behavior, not a production authentication implementation.

## Token storage boundary

[`src/lib/auth/utils.tsx`](../src/lib/auth/utils.tsx) stores the token through [`src/lib/storage.tsx`](../src/lib/storage.tsx). MMKV is not encrypted by this template. Do not persist real credentials or tokens there unless an encrypted storage strategy has been explicitly added and reviewed.

## Replacing the demo

When integrating a backend:

- Replace the mock login handler with a real mutation.
- Define the backend token shape in `TokenType`.
- Add Axios request/refresh handling in `src/lib/api/client.tsx` or a dedicated auth layer.
- Revoke and clear local state on logout or refresh failure.
- Cover signed-out, signed-in, expired-token, and failed-login paths with tests.
