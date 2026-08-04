# Project Documentation

This directory contains the project-facing documentation for the Expo application template. It is intentionally written as plain Markdown so it can be read directly from a checkout, reviewed with code changes, and used by automation or coding agents.

The Astro/Starlight site under [`docs/`](../docs/) remains the browsable reference site. This directory is the operational source for how the repository is structured, configured, tested, and extended.

## Table of Contents

- [Project creation](./project-creation.md)
- [Architecture](./architecture.md)
- [Development workflow](./development.md)
- [Configuration and environments](./configuration.md)
- [Customization](./customization.md)
- [Authentication](./authentication.md)
- [Navigation](./navigation.md)
- [Data fetching](./data-fetching.md)
- [Storage](./storage.md)
- [Local native modules](./native-modules.md)
- [UI and theming](./ui-and-theming.md)
- [UI components](./ui-components.md)
- [Gluestack UI maintenance](./gluestack-ui-maintenance.md)
- [Forms](./forms.md)
- [Fonts](./fonts.md)
- [Testing](./testing.md)
- [Release and CI/CD](./release.md)
- [Production readiness](./production-readiness.md)
- [Dependency upgrades](./dependency-upgrades.md)
- [Documentation structure decision](./decisions/2026-08-03-documentation-structure.md)
- [Gluestack UI migration decision](./decisions/2026-08-03-gluestack-ui-migration.md)

## Quick start

```bash
pnpm install
cp .env.example .env
pnpm start
```

Before an EAS build, complete the ownership checklist in [Configuration and environments](./configuration.md).
