# Dependency Upgrades

Use Expo's installer for Expo-managed, React Native, and native runtime packages:

```bash
pnpm exec expo install <package>
pnpm exec expo install --check
pnpm doctor
```

For an Expo SDK upgrade, follow Expo's upgrade guide, update the SDK and aligned packages together, then run `pnpm check-all`. Keep `react-native-worklets` with Reanimated on SDK 56 and keep the explicit `@isaacs/brace-expansion` dependency until Metro no longer requires it.

After native dependency changes, run a development `prebuild` or native build and verify iOS and Android behavior. Do not commit generated `ios/` or `android/` projects.
