# Dependency Upgrades

**Applies to:** JavaScript, Expo, React Native, and native-runtime dependency
changes.

The current patch baseline is Expo `~57.0.22`, React `19.2.3`, and React Native
`0.86.3`. Keep Expo upgrades within SDK 57 and use `expo install --fix` to align
its managed packages. `expo-image` and `expo-status-bar` are registered in `app.config.ts` as
required by the installer. SDK 57 aligns Reanimated `4.5.1`, Worklets `0.10.1`,
and Gesture Handler `~2.32.0`; React remains on `19.2.3`.

Use Expo's installer for Expo-managed, React Native, and native runtime
packages:

```bash
pnpm exec expo install <package>
pnpm exec expo install --check
pnpm run doctor
```

For an Expo SDK upgrade, follow Expo's upgrade guide, update the SDK and aligned
packages together, then run `pnpm check-all`. Keep `react-native-worklets`
with Reanimated on SDK 57 and keep the explicit `@isaacs/brace-expansion`
resolution until Metro no longer needs it.

SDK 57 recommends `react-native-keyboard-controller@1.21.9`, but this template
intentionally uses the compatible `1.21.14` patch release. Keep it in
`expo.install.exclude` so `expo install --check` does not replace the reviewed
override; re-evaluate the exclusion during the next Expo SDK upgrade.

SDK 57 `expo prebuild` clears and regenerates native directories by default;
use `--no-clean` only when intentionally applying changes to existing generated
projects. Rebuild the development client after upgrading the SDK. See the
[SDK 57 release notes](https://expo.dev/changelog/sdk-57).

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

## Router decoder security compatibility

Expo Router 57.0.21 pulls in `query-string@7.1.3`, whose decoder range still
selects a version affected by
[GHSA-vcc3-ghjq-m6fr](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr).
The workspace override selects the fixed `decode-uri-component@0.5.0`.
Because `query-string@7` requires a CommonJS function, the version-specific
[`decoder patch`](../../patches/decode-uri-component@0.5.0.patch) changes only
the module format and export; the upstream decoding algorithm stays intact.
[`dependency-compat.test.ts`](../../dependency-compat.test.ts) exercises the
actual Router dependency chain, Unicode, repeated parameters, round trips,
and large malformed input. Remove the override and patch together when Router
uses a fixed decoder through a compatible upstream dependency chain.

## Generated animation compatibility

Reanimated 4.5.1 narrows `ZoomIn.withInitialValues` to scale transforms. The
copied Gluestack AlertDialog, Menu, and Modal still pass `opacity: 0` alongside
the scale. The runtime now picks only transform values, ignoring opacity;
these entrances scale without an opacity transition. The narrow declaration in
[`src/types/reanimated-gluestack.d.ts`](../../src/types/reanimated-gluestack.d.ts)
accepts only that legacy literal on `ZoomIn`, keeping generated source intact.
Remove it when an upstream regeneration removes the extra opacity property.

## Current upstream peer warning

A fresh install can report that `react-native-css-interop@0.2.6` expects
Tailwind CSS `~3` while this project uses Tailwind CSS 4. It is transitive from
`@legendapp/motion` through NativeWind; application styling uses Uniwind and
does not import NativeWind. Re-evaluate this note when the dependency chain
changes, and remove it once a clean install no longer reports the warning.
