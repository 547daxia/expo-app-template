# Project Guide

The canonical project guide is maintained in [`documentation/`](./documentation/). Start with [`documentation/Readme.md`](./documentation/Readme.md) for the project structure, development workflow, configuration, testing, and release process.

## Quick start

```bash
pnpm install
cp .env.example .env
pnpm start
```

Use [`documentation/configuration.md`](./documentation/configuration.md) before creating an EAS build. Use [`documentation/development.md`](./documentation/development.md) for daily commands and quality checks.

To build the browsable documentation site locally, run `pnpm --dir docs install` once and then `pnpm docs:build`.
