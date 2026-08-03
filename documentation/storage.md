# Storage

## MMKV wrapper

[`src/lib/storage.tsx`](../src/lib/storage.tsx) exposes synchronous `getItem`, `setItem`, `getString`, and `removeItem` helpers over `react-native-mmkv`.

`getItem` and `setItem` are the typed JSON API: they preserve falsy values such as `false` and `0`, return `null` for missing, malformed, or empty values, and retain compatibility with the template's older unprefixed JSON values. Use `getString` when a value was written directly through MMKV and must remain a raw string.

## Existing keys

| Key | Owner | Purpose |
| --- | --- | --- |
| `token` | `src/lib/auth/` | Demo authentication token; not encrypted |
| `IS_FIRST_TIME` | `src/lib/hooks/use-is-first-time.tsx` | Whether onboarding is still required |
| `SELECTED_THEME` | `src/lib/hooks/use-selected-theme.tsx` | `light`, `dark`, or `system` theme choice |

Use MMKV for ordinary local preferences and small non-sensitive data. Do not use it for passwords, refresh tokens, API keys, or other secrets without adding an encrypted storage implementation.
