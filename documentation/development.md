# Development Workflow

## Requirements

- Node.js LTS
- pnpm 10.12.3 or a compatible pnpm 10 release
- Git
- Watchman on macOS/Linux
- A configured iOS or Android development environment for native runs

## Daily commands

```bash
pnpm install
pnpm start
pnpm ios
pnpm android
pnpm web
```

Environment-specific commands are available for development, preview, and production. Examples:

```bash
pnpm start:preview
pnpm start:production
pnpm prebuild:development
pnpm ios:preview
```

Use `pnpm exec expo install <package>` for Expo-managed, React Native, and native runtime dependencies. After dependency changes, run `pnpm check-all`, `pnpm exec expo install --check`, and `pnpm doctor`.

## Quality checks

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm check-all
pnpm doctor
```

`check-all` runs linting, TypeScript, Jest, Expo dependency alignment, and Expo Doctor. The pre-commit hook checks staged lint and TypeScript changes, while the commit-msg hook enforces Conventional Commits.

## Adding a feature

1. Create `src/features/<feature-name>/` and its `components/` directory when needed.
2. Add a `*-screen.tsx` entry point and keep feature logic inside the feature.
3. Add a thin route re-export under `src/app/`.
4. Add `api.ts` for feature queries/mutations and a Zustand store only when feature state needs to be global.
5. Add focused tests for validation, business logic, or complex interactions.

## Naming and imports

Use kebab-case for files and folders, camelCase for variables and functions, and direct absolute imports across module boundaries. Do not introduce credentials or tokens into `EXPO_PUBLIC_*` variables.
