# Development Workflow

**Applies to:** daily application work. For architectural boundaries, read
[Architecture](../core/architecture.md).

## Requirements

- Node.js 22 LTS
- pnpm 10.12.3 or a compatible pnpm 10 release
- Git and Watchman on macOS/Linux
- Configured iOS or Android tooling for native runs

## Daily commands

```bash
pnpm install
pnpm start
pnpm ios
pnpm android
pnpm web
```

Environment-specific commands include `pnpm start:preview`,
`pnpm start:production`, `pnpm export:production -- --platform web`, and
`pnpm prebuild:development`. Production commands fail until project-owned
identity and API values are configured.

Use `pnpm exec expo install <package>` for Expo-managed, React Native, and
native-runtime dependencies. See [Dependency Upgrades](../quality/dependency-upgrades.md)
for the complete verification workflow.

## Quality checks

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm test:ci
pnpm audit:prod
pnpm audit:ci
pnpm check-all
pnpm doctor
```

`check-all` runs linting, TypeScript, Jest coverage, audits, Expo dependency
alignment, Expo Doctor, and documentation link validation. The
documentation-site dependency install and build remain separate:

```bash
pnpm docs:check
pnpm --dir docs install
pnpm docs:build
```

The pre-commit hook type-checks the project and applies staged-file linting.
The commit-msg hook enforces Conventional Commits; the post-merge hook runs
`pnpm install` when `pnpm-lock.yaml` changes.

## Adding a feature

1. Create `src/features/<feature-name>/`.
2. Add a `*-screen.tsx` entry point and thin route re-export under `src/app/`.
3. Keep feature API hooks in `api.ts`; add Zustand only when state is genuinely
   global.
4. Add focused tests for validation, business logic, or complex interaction.

For generated UI, consult [UI Components](../ui/components.md) and
[Gluestack UI Maintenance](../ui/gluestack-ui-maintenance.md). For native
capabilities, consult [Local Native Modules](../platform/native-modules.md).

## Naming and imports

Use kebab-case paths, camelCase variables/functions, and direct `@/` imports
across module boundaries. Do not place credentials in `EXPO_PUBLIC_*` values.
Use FlashList for project-owned scrollable data; generated list primitives and
the Style Demo are catalog exceptions, not a business-feature pattern.
