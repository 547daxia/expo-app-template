# Release and CI/CD

## EAS profiles

[`eas.json`](../eas.json) defines `development`, `preview`, `production`, and `simulator` profiles. Development builds use a custom dev client and internal distribution; preview builds produce an installable APK for Android; production builds target store distribution.

```bash
pnpm build:development:ios
pnpm build:development:android
pnpm build:preview:ios
pnpm build:preview:android
pnpm build:production:ios
pnpm build:production:android
```

Complete project ownership and environment configuration before running these commands.

## Continuous integration

GitHub Actions under [`.github/workflows/`](../.github/workflows/) run lint, TypeScript, Jest, Expo Doctor, EAS builds, release automation, and optional Maestro Android flows. EAS workflows require an `EXPO_TOKEN` repository secret. Release automation also requires the repository token configuration described in the workflow.

The maintained workflow groups are:

- `lint-ts.yml`, `type-check.yml`, and `test.yml` for pull-request and branch checks
- `expo-doctor.yml` after dependency manifest changes
- `eas-build-preview.yml` and `eas-build-prod.yml` for EAS builds
- `e2e-android*.yml` for opt-in Maestro verification
- `new-app-version.yml` and `new-github-release.yml` for versioning and releases

Match EAS secrets and environment variables to the profile (`development`, `preview`, or `production`). Never put build-only secrets in `EXPO_PUBLIC_*` values.

### Release gate

A pushed version tag creates a GitHub Release only after all required checks pass:

- the tag matches `v${package.json.version}`
- TypeScript, ESLint, and Jest coverage checks
- `expo install --check` dependency alignment and Expo Doctor
- a strict, isolated development `prebuild` using a placeholder API URL
- documentation dependency installation and site build

EAS builds and Maestro end-to-end tests remain separate opt-in workflows. The template does not ship an Expo account, EAS project, signing credentials, or an `EXPO_TOKEN`, so making those requirements part of the default release gate would prevent an unconfigured template from releasing.

## Versioning

The app version comes from `package.json`. The `app-release` script uses `np` to update the version and create a release tag without publishing an npm package. Commit messages follow Conventional Commits and are checked by commitlint.

## Build safety

Do not commit `.env`, credentials, generated `ios/` or `android/` directories, or another project's EAS project ID. Verify the resolved public config with `pnpm exec expo config --type public` before a build.
