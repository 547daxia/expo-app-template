# Project Guide

This file becomes the generated project's root README. The canonical project
guide is [`documentation/`](./documentation/README.md).

## Quick start

```bash
pnpm install
cp .env.example .env
pnpm start
```

Use [Configuration and Environments](./documentation/getting-started/configuration.md)
before EAS Build or EAS Update, and
[Development Workflow](./documentation/getting-started/development.md) for daily
commands and quality checks.

## Find the right guide

- Shared UI: [UI Components](./documentation/ui/components.md) and
  [Gluestack UI Maintenance](./documentation/ui/gluestack-ui-maintenance.md)
- Native capabilities: [Local Native Modules](./documentation/platform/native-modules.md)
- Tests and releases: [Testing](./documentation/quality/testing.md) and
  [Production Readiness](./documentation/operations/production-readiness.md)

Run `pnpm --dir docs install` once, then `pnpm docs:dev` or `pnpm docs:build`
to browse the local Starlight site. It renders this project's local canonical
documentation; no repository URL configuration is required for the prose itself.
