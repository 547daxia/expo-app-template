# Dependency Upgrades

**Applies to:** JavaScript, Expo, React Native, and native-runtime dependency
changes.

Use Expo's installer for Expo-managed, React Native, and native runtime
packages:

```bash
pnpm exec expo install <package>
pnpm exec expo install --check
pnpm doctor
```

For an Expo SDK upgrade, follow Expo's upgrade guide, update the SDK and aligned
packages together, then run `pnpm check-all`. Keep `react-native-worklets`
with Reanimated on SDK 56 and keep the explicit `@isaacs/brace-expansion`
resolution until Metro no longer needs it.

After native dependency changes, run a development prebuild or native build and
verify iOS and Android. Never commit generated root `ios/` or `android/`
directories.

Dependabot checks root application, documentation-site, and GitHub Actions
dependencies weekly. Review dependency PRs through the usual quality gate; do
not auto-merge Expo SDK, React Native, native-runtime, or Gluestack changes
without platform verification. `pnpm audit:prod` checks production
dependencies, while `pnpm audit:ci` also rejects high-severity toolchain
findings.

Gluestack upgrades combine package changes with copied source regeneration; use
the exact workflow in [Gluestack UI Maintenance](../ui/gluestack-ui-maintenance.md)
instead of treating a generic dependency update as sufficient.

## Current upstream peer warning

A fresh install can report that `react-native-css-interop@0.2.6` expects
Tailwind CSS `~3` while this project uses Tailwind CSS 4. It is transitive from
`@legendapp/motion` through NativeWind; application styling uses Uniwind and
does not import NativeWind. Re-evaluate this note when the dependency chain
changes, and remove it once a clean install no longer reports the warning.
