# Testing

## Unit and component tests

Jest with `jest-expo` and React Native Testing Library is configured in [`jest.config.js`](../jest.config.js). Tests use the shared providers from [`src/lib/test-utils.tsx`](../src/lib/test-utils.tsx).

Focus tests on business logic, validation, storage behavior, navigation helpers, and components with meaningful state or conditional rendering. Purely presentational wrappers generally do not need exhaustive tests.

```bash
pnpm test
pnpm test:watch
pnpm test:ci
```

The Jest configuration enforces modest global coverage floors. Increase them as production logic and integration coverage grow; do not lower them to accommodate untested changes.

## End-to-end tests

Maestro flows live under [`.maestro/`](../.maestro/). They cover onboarding, login validation, tabs, and creating a post.

```bash
pnpm install-maestro
pnpm e2e-test                  # development build (backwards-compatible default)
pnpm e2e-test:preview          # preview build
```

E2E tests require the matching development or preview build to be installed on a device/emulator. The two scripts target `com.example.mobileapp.development` and `com.example.mobileapp.preview` respectively. Update the scripts, or pass the appropriate `APP_ID` directly to Maestro, after changing application identifiers.

## Verification expectations

Before a pull request, run `pnpm check-all`. If a native dependency or Expo package changed, also run `pnpm exec expo install --check`, `pnpm doctor`, and a relevant development build.
