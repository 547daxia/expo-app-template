# Testing

**Applies to:** unit, component, Web-export, and Android Maestro verification.

## Unit and component tests

Jest with `jest-expo` and React Native Testing Library is configured in
[`jest.config.js`](../../jest.config.js). Shared test providers live in
[`src/lib/test-utils.tsx`](../../src/lib/test-utils.tsx).

```bash
pnpm test
pnpm test:watch
pnpm test:ci
```

Focus tests on business logic, validation, storage behavior, navigation helpers,
and meaningful component state. The coverage target and exact included paths are
defined by `collectCoverageFrom` and `coverageThreshold` in `jest.config.js`;
do not duplicate those volatile values in prose. Generated primitives are
excluded, except the explicitly transitional DatePicker, DateTimePicker,
ImageViewer, and Tabs groups until their project-owned behavior moves out.

Use `axios-mock-adapter` for API tests. Reference tests live beside the client,
pagination helpers, Feed hooks, and authentication store.

## Web verification

Validate Web-only entrypoints with:

```bash
pnpm export:production -- --platform web
```

This requires configured production identity and API values. Web export is a
release check, not part of `pnpm check-all`.

## End-to-end tests

Maestro flows under [`.maestro/`](../../.maestro/) cover onboarding, login
validation, tabs, and post creation.

```bash
pnpm install-maestro
pnpm e2e-test
pnpm e2e-test:preview
```

A matching development or preview build must be installed on the target
device/emulator. The CLI rewrites both the `e2e-test:*` package scripts and the
template's Android Maestro workflow `APP_ID` values. When changing identifiers
manually, update both the package scripts and
[`.github/workflows/e2e-android*.yml`](../../.github/workflows/).

The included hosted flows verify Android only. Maestro Cloud additionally needs
`MAESTRO_CLOUD_API_KEY` and `MAESTRO_CLOUD_PROJECT_ID`; the workflows are
opt-in because native builds are expensive.

## Verification expectations

Before a pull request, run `pnpm check-all`. After an Expo or native dependency
change, also run `pnpm exec expo install --check`, `pnpm doctor`, and a
relevant development build. Generated-group changes must keep the Style Demo
inventory test green and be inspected on every affected platform.
