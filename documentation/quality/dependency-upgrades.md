# Dependency Upgrades

**Applies to:** JavaScript, Expo, React Native, and native-runtime dependency
changes.

The current patch baseline is Expo `~56.0.21`, React `19.2.3`, and React Native
`0.85.3`. Keep Expo upgrades within SDK 56 and use `expo install --fix` to align
its managed packages. `expo-image` is registered in `app.config.ts` as required
by the updated installer.

Use Expo's installer for Expo-managed, React Native, and native runtime
packages:

```bash
pnpm exec expo install <package>
pnpm exec expo install --check
pnpm run doctor
```

For an Expo SDK upgrade, follow Expo's upgrade guide, update the SDK and aligned
packages together, then run `pnpm check-all`. Keep `react-native-worklets`
with Reanimated on SDK 56 and keep the explicit `@isaacs/brace-expansion`
resolution until Metro no longer needs it.

SDK 56 recommends `react-native-keyboard-controller@1.21.6`, but this template
intentionally uses the compatible `1.21.14` patch release. Keep it in
`expo.install.exclude` so `expo install --check` does not replace the reviewed
override; re-evaluate the exclusion during the next Expo SDK upgrade.

After native dependency changes, run a development prebuild or native build and
verify iOS and Android. Never commit generated root `ios/` or `android/`
directories.

Dependabot checks root application, documentation-site, and GitHub Actions
dependencies weekly. Review dependency PRs through the usual quality gate; do
not auto-merge Expo SDK, React Native, native-runtime, or Gluestack changes
without platform verification. `pnpm audit:prod` checks production
dependencies, while `pnpm audit:ci` also rejects high-severity toolchain
findings.

Keep the security resolutions in `pnpm-workspace.yaml` current. The exact
`semver@6.3.1` trust-policy exception is used by Expo/Babel; its registry SHA-512
integrity was checked against the existing lockfile. The exception does not
disable the policy for other packages or semver releases.

Gluestack upgrades combine package changes with copied source regeneration; use
the exact workflow in [Gluestack UI Maintenance](../ui/gluestack-ui-maintenance.md)
instead of treating a generic dependency update as sufficient.

## Current upstream peer warning

A fresh install can report that `react-native-css-interop@0.2.6` expects
Tailwind CSS `~3` while this project uses Tailwind CSS 4. It is transitive from
`@legendapp/motion` through NativeWind; application styling uses Uniwind and
does not import NativeWind. Re-evaluate this note when the dependency chain
changes, and remove it once a clean install no longer reports the warning.
