# Dependency Upgrades

Use Expo's installer for Expo-managed, React Native, and native runtime packages:

```bash
pnpm exec expo install <package>
pnpm exec expo install --check
pnpm doctor
```

For an Expo SDK upgrade, follow Expo's upgrade guide, update the SDK and aligned packages together, then run `pnpm check-all`. Keep `react-native-worklets` with Reanimated on SDK 56 and keep the explicit `@isaacs/brace-expansion` dependency until Metro no longer requires it.

After native dependency changes, run a development `prebuild` or native build and verify iOS and Android behavior. Do not commit generated `ios/` or `android/` projects.

Dependabot checks the root application, documentation site, and GitHub Actions
weekly through `.github/dependabot.yml`. Review and merge dependency PRs through
the normal quality gate; do not auto-merge Expo SDK, React Native, native
runtime, or Gluestack changes without platform verification. `pnpm audit:prod`
runs locally, in pull-request tests, and before GitHub Releases. Keep committed
workflow and build scripts on reviewed exact tool versions rather than
`@latest`. `pnpm audit:ci` additionally rejects high-severity findings in the
development and build toolchain.

## Gluestack UI

Gluestack upgrades change both package dependencies and copied component
source. Do not treat `gluestack-ui upgrade` as a generic major-version updater;
its behavior depends on the release and may be limited to styling-engine
migration. Follow the target release's migration guide, use an exact CLI
version, and regenerate components only from a clean upgrade branch or isolated
worktree.

`src/components/ui/` is the replaceable generated layer. Project wrappers and
custom behavior belong in `src/components/` or the owning feature so an upgrade
can overwrite generated files safely. See
[Gluestack UI Maintenance](./gluestack-ui-maintenance.md) for the complete
version-record, regeneration, validation, and rollback workflow.

## Current upstream peer warning

A fresh `pnpm install` may report that `react-native-css-interop@0.2.6`
expects Tailwind CSS `~3` while the project uses Tailwind CSS 4. The package is
installed transitively because `@legendapp/motion` declares NativeWind as a
peer; application styling is provided by Uniwind, and project source does not
import NativeWind. Expo Doctor, native prebuild, tests, and all-platform bundle
export currently pass with this dependency graph.

Do not hide the warning with an arbitrary Tailwind downgrade or incompatible
override. Re-evaluate the transitive chain when `@legendapp/motion`, NativeWind,
or `react-native-css-interop` publishes a compatible release, and remove the
note once a clean install no longer reports it.
