# Architecture

**Applies to:** project-wide boundaries and provider composition. For routine
feature work, start with [Development Workflow](../getting-started/development.md).

## Runtime stack

- Expo SDK 56, React Native 0.85, React 19, TypeScript, and Expo Router
- Continuous Native Generation (CNG)
- Gluestack UI, Uniwind, and Tailwind CSS for shared UI and styling
- FlashList for project-owned data lists
- TanStack Query, Axios, React Query Kit, TanStack Form, Zod, and Zustand
- Expo SecureStore for native credentials and MMKV for non-sensitive state

## Repository boundaries

| Path | Responsibility |
| --- | --- |
| `src/app/` | Expo Router layouts and thin route re-exports |
| `src/features/` | Feature-owned screens, components, and API hooks |
| `src/components/ui/` | Replaceable Gluestack-generated primitives and provider code |
| `src/components/` | Shared project-owned wrappers and compound components |
| `src/lib/` | API infrastructure, storage, navigation, auth utilities and session store, and global hooks |
| `modules/` | Project-local Expo native modules and TypeScript facades |
| `assets/` | App icon, splash, adaptive icon, and Web favicon |
| `documentation/` | Canonical operational documentation |
| `docs/` | Starlight presentation and search layer generated from canonical docs |

## Feature conventions

Use kebab-case feature directories and `*-screen.tsx` screen files. Keep
feature-only components under `src/features/<feature>/components/`. A route
should normally remain a thin re-export:

```tsx
export { FeedScreen as default } from '@/features/feed/feed-screen';
```

Use relative imports inside one feature and `@/` imports across boundaries.
Features may import an unmodified generated primitive directly. Reusable UI
behavior belongs in `src/components/`; generated UI must not import project
code. See [UI Components](../ui/components.md).

ESLint enforces these boundaries: `src/lib` and `src/components` may not import
`@/features/**`, and features may not import other features. Route files in
`src/app/` are the only composition point allowed to import feature code.

## Root composition

[`src/app/_layout.tsx`](../../src/app/_layout.tsx) composes gesture handling,
Gluestack UI, keyboard handling, navigation theming, React Query, bottom-sheet
modals, and flash messages. It restores theme selection, hydrates
authentication while retaining the splash screen, and exposes a recoverable
error boundary. The route tree is not mounted until auth hydration resolves;
storage failures fail closed to signed-out state.

[`src/app/(app)/_layout.tsx`](../../src/app/%28app%29/_layout.tsx) redirects
first-time users to onboarding, signed-out users to login, and otherwise
renders Feed, Style, and Settings tabs.

## Native generation

Generated `ios/` and `android/` projects are local CNG artifacts and must not
be committed. Durable native configuration belongs in `app.config.ts` or an
idempotent config plugin. See [Local Native Modules](../platform/native-modules.md).
