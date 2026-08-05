# Repository Instructions

This repository is an Expo SDK 56, React Native 0.85, React 19, TypeScript, and
Expo Router template. The canonical human and AI-readable operational guidance
is [documentation/README.md](./documentation/README.md). Read the linked topic
before changing configuration, generated UI, native modules, testing, or release
automation.

## Non-negotiable boundaries

- Keep routes in `src/app/` thin; feature logic belongs in `src/features/`.
- Use `@/` imports across boundaries. Relative imports are allowed inside a
  feature or sibling component folder.
- Use TanStack Form with Zod for forms, React Query for server state, Zustand
  for global client state, FlashList for project-owned scrollable data, and MMKV
  only for non-sensitive data.
- Store native authentication tokens through
  `src/lib/auth/token-storage.ts` and Expo SecureStore. Never persist
  credentials in MMKV, localStorage, or IndexedDB.
- `src/components/ui/` is replaceable Gluestack-generated source. Do not edit
  it, add helpers/tests there, create a barrel, or recreate `legacy-ui`.
  Reusable behavior belongs in `src/components/`; feature-only UI belongs in the
  owning feature. Follow
  [Gluestack UI Maintenance](./documentation/ui/gluestack-ui-maintenance.md).
- Keep the Style Demo inventory synchronized with every top-level generated UI
  group. Generated UI and the Style Demo are the only FlatList exceptions.
- Prefer an existing Expo package before creating a local module under
  `modules/`. Do not commit generated root `ios/` or `android/` projects.
- Use `pnpm exec expo install` for Expo-managed, React Native, and native
  runtime dependencies. Keep `react-native-worklets` with Reanimated and retain
  the reviewed `pnpm.overrides` entries.
- Treat `EXPO_PUBLIC_*` values as client-visible. Production configuration
  validates name, bundle/package identifiers, HTTPS API, and demo hosts; EAS
  owner, slug, and project ID remain required setup steps in
  [Configuration](./documentation/getting-started/configuration.md).

## Required checks

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm check-all
```

After dependency changes, also run `pnpm exec expo install --check`, `pnpm doctor`,
and relevant native verification. For documentation changes, run `pnpm docs:check`;
run `pnpm --dir docs install && pnpm docs:build` when changing the Starlight
presentation or canonical-document rendering.

## Project-specific guides

- [Architecture](./documentation/core/architecture.md)
- [Development workflow](./documentation/getting-started/development.md)
- [Testing](./documentation/quality/testing.md)
- [Release and CI/CD](./documentation/operations/release.md)
- [Production readiness](./documentation/operations/production-readiness.md)
