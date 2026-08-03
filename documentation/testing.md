# Testing

## Unit and component tests

Jest with `jest-expo` and React Native Testing Library is configured in [`jest.config.js`](../jest.config.js). Tests use the shared providers from [`src/lib/test-utils.tsx`](../src/lib/test-utils.tsx).

Focus tests on business logic, validation, storage behavior, navigation helpers, and components with meaningful state or conditional rendering. Purely presentational wrappers generally do not need exhaustive tests.

```bash
pnpm test
pnpm test:watch
pnpm test:ci
```

Coverage includes routes, feature logic, shared libraries, and the custom Chat
AI, DatePicker, DateTimePicker, ImageViewer, and Tabs layers. Gluestack
CLI-generated primitives and native Jest-incompatible Web entrypoints are
excluded; Web is validated by Expo export and browser/E2E checks. Current global
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

## Verification expectations

Before a pull request, run `pnpm check-all`. If a native dependency or Expo
package changed, also run `pnpm exec expo install --check`, `pnpm doctor`, and a
relevant development build. Shared UI changes must keep the Style Demo inventory
test green and should be checked in the Style tab on each affected platform.
