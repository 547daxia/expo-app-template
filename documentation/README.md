# Project Documentation

This directory is the single source of truth for repository operation and
application-extension guidance. It is plain Markdown so it works from a local
checkout, on GitHub, and in coding agents. The Starlight site under
[`docs/`](../docs/) renders this content during its build; do not create a
second copy of an operational topic there.

## Start here

- **Adopting the template:** [Project Creation](./getting-started/project-creation.md), then [Configuration and Environments](./getting-started/configuration.md).
- **Building a feature:** [Development Workflow](./getting-started/development.md), then [Architecture](./core/architecture.md).
- **Preparing a release:** [Production Readiness](./operations/production-readiness.md), [Release and CI/CD](./operations/release.md), and [Testing](./quality/testing.md).
- **Changing generated UI or native code:** [Gluestack UI Maintenance](./ui/gluestack-ui-maintenance.md) or [Local Native Modules](./platform/native-modules.md).

## Documentation map

### Getting started

- [Project creation](./getting-started/project-creation.md)
- [Configuration and environments](./getting-started/configuration.md)
- [Development workflow](./getting-started/development.md)

### Core application

- [Architecture](./core/architecture.md)
- [Authentication](./core/authentication.md)
- [Navigation](./core/navigation.md)
- [Data fetching](./core/data-fetching.md)
- [Storage](./core/storage.md)

### UI and platform

- [UI overview and theming](./ui/README.md)
- [UI components](./ui/components.md)
- [Gluestack UI maintenance](./ui/gluestack-ui-maintenance.md)
- [Forms](./ui/forms.md)
- [Fonts](./ui/fonts.md)
- [Local native modules](./platform/native-modules.md)

### Quality and operations

- [Testing](./quality/testing.md)
- [Dependency upgrades](./quality/dependency-upgrades.md)
- [Release and CI/CD](./operations/release.md)
- [Production readiness](./operations/production-readiness.md)

### Optional integrations and decisions

- [Sentry](./recipes/sentry.md)
- [Documentation structure decision](./decisions/2026-08-03-documentation-structure.md)
- [Gluestack UI migration decision](./decisions/2026-08-03-gluestack-ui-migration.md)

## Quick start

```bash
pnpm install
cp .env.example .env
pnpm start
```

Before an EAS build, complete the ownership checklist in
[Configuration and Environments](./getting-started/configuration.md).
