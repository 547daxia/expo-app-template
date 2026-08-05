# Storage

**Applies to:** local preferences and token-storage boundaries. See
[Authentication](./authentication.md) for session lifecycle behavior.

## MMKV wrapper

[`src/lib/storage.tsx`](../../src/lib/storage.tsx) exposes synchronous
`getItem`, `setItem`, `getString`, and `removeItem` helpers over
`react-native-mmkv`. `getItem` and `setItem` are the typed JSON API: they
preserve falsy values, return `null` for missing, malformed, or empty values,
and retain compatibility with older unprefixed JSON values. Use `getString`
only for values deliberately written directly through MMKV.

## Existing keys

| Key | Owner | Purpose |
| --- | --- | --- |
| `IS_FIRST_TIME` | `src/lib/hooks/use-is-first-time.tsx` | Whether onboarding is still required |
| `SELECTED_THEME` | `src/lib/hooks/use-selected-theme.tsx` | `light`, `dark`, or `system` theme choice |

Use MMKV only for ordinary local preferences and small non-sensitive data. Do
not store passwords, refresh tokens, API keys, or other secrets there.

## Authentication credentials

Native authentication values are validated by
[`src/lib/auth/utils.tsx`](../../src/lib/auth/utils.tsx) and persisted through
Expo SecureStore by
[`src/lib/auth/token-storage.ts`](../../src/lib/auth/token-storage.ts). On Web,
`token-storage.web.ts` deliberately does not persist bearer tokens in
JavaScript-readable browser storage; use server-managed Secure and HttpOnly
cookies for persistent sessions.
