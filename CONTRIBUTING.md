# Contributing

Contributions to code, tests, documentation, and project tooling are welcome.

## Before opening a pull request

1. Keep feature code in its owning `src/features/` directory, reusable
   project UI in `src/components/`, and replaceable Gluestack primitives in
   `src/components/ui/`.
2. Update the relevant canonical page in `documentation/` whenever behavior,
   configuration, testing, release requirements, or ownership boundaries change.
3. Run `pnpm check-all`. Run `pnpm docs:check` for documentation changes and
   `pnpm --dir docs install && pnpm docs:build` when the Starlight presentation
   or canonical-document rendering changes.
4. Verify affected native or Web platforms. Keep the Style Demo inventory
   synchronized when shared UI changes.
5. Never include `.env` files, credentials, generated root native projects, or
   another project's EAS identifiers.

## Proposals and reports

Use GitHub issues for reproducible bugs or scoped enhancements, and discussions
for questions or broad proposals. Include the route, component, command, platform,
application environment, and sanitized logs/screenshots where relevant.

## Pull-request description

Explain the motivation, affected surfaces, and verification performed. For a
Gluestack generated-source change, follow
[UI Maintenance](./documentation/ui/gluestack-ui-maintenance.md) and record the
exact generation command and versions.
