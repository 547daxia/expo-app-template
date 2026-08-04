# Local Native Modules

## Included example

The template includes `modules/expo-template-native/`, a minimal local module
created with Expo's official module scaffold. It demonstrates the complete
integration path without adding a third-party SDK, permission, native view, or
config plugin:

| Layer | Responsibility |
| --- | --- |
| `index.ts` | Stable application-facing TypeScript API |
| `src/` | Native binding, shared return type, and Web fallback |
| `android/` | Kotlin module registered as `ExpoTemplateNative` |
| `ios/` | Swift module and CocoaPods specification |
| `expo-module.config.json` | Android, Apple, and Web discovery metadata |

`getNativeRuntimeInfo()` returns the platform and system version. Settings uses
it to display the `Native Runtime` row, so the example is exercised by the
application rather than existing only as unused sample code.

```ts
import { getNativeRuntimeInfo } from 'modules/expo-template-native';

const { platform, systemVersion } = getNativeRuntimeInfo();
```

Android reads `Build.VERSION.RELEASE`, iOS reads
`UIDevice.current.systemVersion`, and Web returns a deterministic browser
fallback.

## Running the example

Local modules are compiled into the native application and are not added to an
already-installed binary by Metro or Fast Refresh. After cloning or changing
Kotlin, Swift, the podspec, Gradle configuration, or module registration, build
a new development client:

```bash
pnpm prebuild:development
pnpm ios
# or
pnpm android
```

The template uses Continuous Native Generation. Do not commit the generated
`ios/` or `android/` directories. This example is unavailable in Expo Go; use
the included development-client workflow. TypeScript-only and Web fallback
changes can still use normal bundler reloads. Module-local Android/iOS build
outputs are ignored by Git as well.

## Creating another local module

Start from the official scaffold rather than copying this example or manually
inventing Gradle and podspec files:

```bash
CI=1 npx create-expo-module@latest --local \
  --name DeviceCapability \
  --description "Project-owned device capability" \
  --package expo.modules.devicecapability
```

In non-interactive mode the command creates `modules/my-module/`. Rename that
directory to a kebab-case module name, then rebuild the native application. If
an `ios/` project currently exists, run CocoaPods installation after renaming;
regenerating with `pnpm prebuild:development` also refreshes native links.

Remove generated APIs, native views, events, and Web files that the module does
not actually need. Keep a small TypeScript facade at the module root instead of
letting feature code depend directly on `requireNativeModule`.

## When a config plugin is required

Autolinking registers native module classes; it does not perform arbitrary
changes to native projects. Add a project-local Expo config plugin only when a
module must declaratively change items such as:

- Android manifest entries, Gradle repositories, resources, or placeholders;
- iOS `Info.plist`, entitlements, frameworks, resources, or Xcode settings;
- native permissions or vendor SDK configuration.

Register such a plugin in `app.config.ts`, make it idempotent, and verify a
clean prebuild. A module like this example, which only calls platform APIs and
needs no configuration, must not add an empty plugin.

## Maintenance and verification

Keep native method names and returned shapes identical across Kotlin, Swift,
TypeScript, and Web. Prefer Expo SDK types and platform APIs over extra
dependencies. Never put credentials or vendor production configuration inside
a reusable example.

After changing a local module, run:

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

The JavaScript tests mock the native boundary; they do not prove Kotlin or
Swift behavior. Before release, open Settings on physical or simulated Android
and iOS development builds and verify the runtime row. Also run the Web export
to cover the `.web.ts` implementation.
