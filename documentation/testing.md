# Testing

## Unit and component tests

Jest with `jest-expo` and React Native Testing Library is configured in [`jest.config.js`](../jest.config.js). Tests use the shared providers from [`src/lib/test-utils.tsx`](../src/lib/test-utils.tsx).

Focus tests on business logic, validation, storage behavior, navigation helpers, and components with meaningful state or conditional rendering. Purely presentational wrappers generally do not need exhaustive tests.

```bash
pnpm test
pnpm test:watch
pnpm test:ci
```

Jest executes every matching test file. Coverage collection currently targets
routes, Auth, Feed, Onboarding, Settings, shared libraries, and the hand-written
transitional DatePicker, DateTimePicker, ImageViewer, and Tabs groups.
The remaining Gluestack CLI-generated primitives and native-Jest-incompatible
Web entrypoints are excluded. New project tests must not be added to
`src/components/ui/`; transitional tests currently located there must move with
their project-owned behavior when that behavior is extracted. Validate Web
entrypoints with `pnpm export:production -- --platform web` after configuring
the production identity and API, followed by browser checks. Web export is a
release verification step and is not run by `pnpm check-all`. Current global
floors are 35% branches, 30% functions, 35% lines, and 35% statements. Increase
them as production logic and integration coverage grow; do not lower them to
accommodate untested changes.

## End-to-end tests

Maestro flows live under [`.maestro/`](../.maestro/). They cover onboarding, login validation, tabs, and creating a post.

```bash
pnpm install-maestro
pnpm e2e-test                  # development build (backwards-compatible default)
pnpm e2e-test:preview          # preview build
```

E2E tests require the matching development or preview build to be installed on a device/emulator. The two scripts target `com.example.mobileapp.development` and `com.example.mobileapp.preview` respectively. Update the scripts, or pass the appropriate `APP_ID` directly to Maestro, after changing application identifiers.

The included GitHub-hosted E2E workflows run Android only. The `.maestro/`
definitions are shared, but this repository does not provide or claim verified
iOS or Web runners for them. The Android workflow uses API 35 and a pinned
Maestro CLI. The Maestro Cloud workflow additionally requires
`MAESTRO_CLOUD_API_KEY` and
`MAESTRO_CLOUD_PROJECT_ID`. These workflows remain opt-in because native builds
are comparatively expensive; run the matching flow before a release that
changes navigation, authentication, native configuration, or a critical user
journey.

## Verification expectations

Before a pull request, run `pnpm check-all`. If a native dependency or Expo
package changed, also run `pnpm exec expo install --check`, `pnpm doctor`, and a
relevant development build. Changes to generated groups must keep the Style Demo
inventory test green; generated and reusable project UI should be checked in the
Style tab on each affected platform.

Local Expo Module tests mock the JavaScript/native boundary. They validate the
TypeScript facade but cannot replace Android/iOS autolinking and development
build verification. Follow [Local Native Modules](./native-modules.md) after
changing Kotlin, Swift, Gradle, podspec, or module registration files.
