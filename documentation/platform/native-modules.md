# Local Native Modules

**Applies to:** project-specific native capabilities not supplied by a maintained
Expo package. Read [Architecture](../core/architecture.md) first for the CNG
boundary.

## Included example

The template includes `modules/expo-template-native/`, a minimal local module
created with Expo's official scaffold. It exposes the stable
`getNativeRuntimeInfo()` facade, implements it in Kotlin and Swift, and provides
a deterministic Web fallback. Settings displays the returned runtime row, so the
example is exercised in the application.

```ts
import { getNativeRuntimeInfo } from 'modules/expo-template-native';

const runtime = getNativeRuntimeInfo();
```

## Build lifecycle

Local modules are compiled into a native application and cannot be added to an
installed binary by Metro or Fast Refresh. After changing Kotlin, Swift, a
podspec, Gradle configuration, or module registration, build a new development
client:

```bash
pnpm prebuild:development
pnpm ios
# or
pnpm android
```

This module is unavailable in Expo Go. TypeScript-only and Web-fallback changes
can use normal bundler reloads. Never commit generated root `ios/` or
`android/` directories.

## Creating another local module

Start with the official scaffold rather than copying this example:

```bash
CI=1 npx create-expo-module@latest --local \
  --name DeviceCapability \
  --description "Project-owned device capability" \
  --package expo.modules.devicecapability
```

Rename the resulting directory to a kebab-case module name, remove unused
generated APIs/views/events, retain a small root TypeScript facade, and rebuild
the native app.

## Config-plugin boundary

Autolinking registers module classes; it does not change arbitrary native
configuration. Add an idempotent project-local config plugin only when a module
must change Android manifests, Gradle/resources, iOS Info.plist/entitlements,
permissions, or vendor SDK configuration. Register it in `app.config.ts` and
verify a clean prebuild. Do not add an empty plugin to a module that needs none.

## Verification

After a local-module change, run lint, type checks, tests, autolinking checks,
and a development prebuild:

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm exec expo-modules-autolinking search --platform android
pnpm exec expo-modules-autolinking search --platform apple
pnpm exec expo-modules-autolinking resolve --platform android
pnpm exec expo-modules-autolinking resolve --platform apple
pnpm prebuild:development
```

JavaScript tests mock the native boundary and do not prove Kotlin or Swift
behavior. Before release, verify Settings on Android and iOS development builds
and run the Web export for the `.web.ts` implementation.
