# Development Workflow

## Requirements

- Node.js 22 LTS
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
pnpm export:production -- --platform web
pnpm prebuild:development
pnpm ios:preview
```

Production start and export commands fail until the template identity and demo
API have been replaced with project-owned values. Any production configuration
path fails closed even when invoked directly through Expo CLI.

Use `pnpm exec expo install <package>` for Expo-managed, React Native, and native runtime dependencies. After dependency changes, run `pnpm check-all`, `pnpm exec expo install --check`, and `pnpm doctor`.

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

`check-all` runs linting, TypeScript, Jest with coverage thresholds, the
production dependency audit, the high-severity full dependency audit, Expo
dependency alignment, and Expo Doctor. The
documentation site build and Expo bundle exports are separate checks; run
`pnpm --dir docs install` once before `pnpm docs:build`, and run the relevant
Expo export or native build before a release. The pre-commit hook runs
TypeScript against the whole project, then applies the
staged-file ESLint checks from `lint-staged` (JavaScript, TypeScript, and JSON).
The commit-msg hook enforces Conventional Commits. The post-merge hook runs
`pnpm install` when `pnpm-lock.yaml` changed.

## Adding a feature

1. Create `src/features/<feature-name>/` and its `components/` directory when needed.
2. Add a `*-screen.tsx` entry point and keep feature logic inside the feature.
3. Add a thin route re-export under `src/app/`.
4. Add `api.ts` for feature queries/mutations and a Zustand store only when feature state needs to be global.
5. Add focused tests for validation, business logic, or complex interactions.

## Adding shared UI

Use a reviewed, explicit Gluestack CLI version when adding an upstream
primitive:

```bash
pnpm dlx gluestack-ui@<cli-version> add <component> \
  --path src/components/ui \
  --use-pnpm \
  -y
```

Treat `src/components/ui/` as a replaceable generated layer: do not manually
edit its files or add project tests and helpers there. Put reusable project
styling, defaults, composition, and behavior in `src/components/<component>/`;
put feature-only UI in the owning feature. Add focused tests beside the
project-owned layer.

Add installed generated groups and reusable project components to the Style
Demo as appropriate. Update `component-groups.ts` whenever a top-level generated
UI directory changes; its inventory test fails if the catalog and filesystem
drift apart. Follow [Gluestack UI Maintenance](./gluestack-ui-maintenance.md)
before regenerating or upgrading components.

## Adding native capabilities

Prefer an existing maintained Expo package. When the capability is
project-specific, create a local Expo Module under `modules/` with the official
scaffold and keep generated native projects out of Git. Follow
[Local Native Modules](./native-modules.md) for the example, build lifecycle,
config-plugin boundary, and verification commands.

## Naming and imports

Use kebab-case for files and folders, camelCase for variables and functions, and direct absolute imports across module boundaries. Do not introduce credentials or tokens into `EXPO_PUBLIC_*` variables.

Use `FlashList` from `@shopify/flash-list` for project-owned scrollable data
lists. ESLint rejects `FlatList` imports from `react-native` and the generated
`@/components/ui/flat-list` wrapper in application code. The generated UI layer
and Style Demo are excluded because they preserve upstream component coverage;
do not use those exclusions as a business-feature pattern.

## Editor tooling

The optional [`.vscode/`](../.vscode/) configuration recommends extensions,
uses ESLint for save-time fixes, and provides snippets aligned with explicit UI
component imports, `@/lib/api`, and the shared Expo Router navigation helper.
The snippets are conveniences rather than architectural APIs; keep them in sync
when import boundaries or shared helpers change.
