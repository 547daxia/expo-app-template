# Authentication

**Applies to:** the demo session flow and token boundary. A production backend
must supply its own authentication adapter and refresh contract.

## Current flow

Authentication state is owned by
[`src/features/auth/use-auth-store.tsx`](../../src/features/auth/use-auth-store.tsx).
It exposes `idle`, `signOut`, and `signIn` states plus `signIn`, `signOut`, and
`hydrate` actions.

The root layout calls asynchronous hydration while retaining the native splash
screen. Missing, malformed, unreadable, or slow tokens fail closed to signed-out
state; hydration has a ten-second timeout. Logout changes in-memory state only
after SecureStore confirms removal. If deletion fails, the current session stays
visible and Settings reports the failure.

In development and preview, login accepts a valid email plus a password of at
least six characters and persists mock access and refresh values. Demo sign-in
is explicitly disabled when `EXPO_PUBLIC_APP_ENV=production`.

## Token-storage boundary

[`src/lib/auth/utils.tsx`](../../src/lib/auth/utils.tsx) validates and serializes
the token. Native builds use Expo SecureStore through
[`src/lib/auth/token-storage.ts`](../../src/lib/auth/token-storage.ts). Web
deliberately does not persist bearer tokens in browser-readable storage; use
server-managed Secure and HttpOnly cookies for persistent browser sessions.

## Request interception

[`src/lib/api/client.tsx`](../../src/lib/api/client.tsx) provides a reference
interceptor that caches successfully read tokens, adds Bearer credentials, and
performs one queued refresh cycle for concurrent 401 responses. It assumes the
default `/auth/refresh` endpoint and `{ access, refresh }` response shape until
a project adapts it to its backend.

On refresh failure, cleanup attempts to remove persisted credentials and enter
signed-out state. If secure-storage deletion fails, the store deliberately
preserves the visible session rather than reporting a logout that would reappear
after restart.

## Replacing the demo

1. Replace the mock login handler with a real feature mutation.
2. Define and validate the backend token shape in `TokenType`.
3. Update the refresh endpoint and response contract in `src/lib/api/client.tsx`.
4. Test signed-out, signed-in, expired-token, refresh-failure, and failed-login
   behavior against the real backend.

See [Data Fetching](./data-fetching.md) for feature-query guidance and
[Storage](./storage.md) for the non-sensitive-data boundary.
