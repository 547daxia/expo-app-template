# Release and CI/CD

**Applies to:** EAS builds, GitHub Actions, versioning, and release gates.
Complete [Configuration and Environments](../getting-started/configuration.md)
before running a project-owned build.

## EAS profiles

[`eas.json`](../../eas.json) defines `development`, `preview`,
`production`, and `simulator` profiles. Development builds use a custom
client and internal distribution; preview produces an Android APK; production
targets store distribution.

```bash
pnpm build:development:ios
pnpm build:development:android
pnpm build:preview:ios
pnpm build:preview:android
pnpm build:production:ios
pnpm build:production:android
```

The manual production workflow requests Android and iOS. The automated preview
workflow currently requests Android only until preview iOS credentials are
configured.

## Continuous integration

Executable definitions live under [`.github/workflows/`](../../.github/workflows/).
Ordinary pull requests run linting, type checks, Jest coverage, and dependency
auditing. Expo Doctor runs for manifest changes; the documentation workflow runs
for canonical-doc, site, or manifest changes. EAS workflows require
`EXPO_TOKEN`; Maestro Cloud additionally requires
`MAESTRO_CLOUD_API_KEY` and `MAESTRO_CLOUD_PROJECT_ID`.

A pushed version tag creates a GitHub Release only after tag/version matching,
linting, type checks, tests, audits, Expo alignment, strict development
prebuild, Doctor, canonical-link validation, and the documentation-site build.

The preview workflow can run manually or on a published GitHub Release. A
release created with the default `GITHUB_TOKEN` does not trigger that release
event automatically; run it manually or use an appropriate GitHub App/PAT
strategy if automatic chaining is required.

## Versioning and build safety

The application version is in `package.json`. `pnpm app-release` uses
`np` to create a version commit and tag without publishing an npm package.
Commit messages follow Conventional Commits.

Do not commit `.env`, credentials, generated root native projects, or another
project's EAS project ID. Verify resolved public config with
`pnpm exec expo config --type public` before a build. Use
[Production Readiness](./production-readiness.md) as the final project-owned
release checklist.
