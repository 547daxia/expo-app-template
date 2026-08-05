# Project Creation

**Applies to:** template adopters. The final section is only for maintainers of
this source template and its CLI.

## Requirements

Creating a project requires Node.js 22 or later, pnpm 10, and Git. The CLI uses
Node.js built-ins and installs application dependencies with `pnpm`.

## Maintained CLI

Create a project from the latest published template release:

```bash
npx create-expo-app-template@latest customer-portal
```

The name must be one direct-child directory name containing letters, numbers,
dots, underscores, or hyphens. Paths, whitespace, hidden-directory names, and
shell syntax are rejected.

For `customer-portal`, the CLI derives:

| Value | Generated result |
| --- | --- |
| Directory and npm package | `customer-portal` |
| Display name | `Customer Portal` |
| Expo slug and scheme | `customer-portal` |
| Production iOS/Android identifier | `com.customerportal` |
| Preview identifier | `com.customerportal.preview` |
| Development identifier | `com.customerportal.development` |
| Initial application version | `0.0.1` |

The CLI clones the selected release, removes template-only files, replaces
identity constants in `env.ts`, the slug defaults, local Maestro scripts, and
the Android Maestro workflow `APP_ID` values. It initializes a fresh `main`
repository and installs dependencies. The generated project retains this
canonical documentation, the documentation-site presentation layer, workflows,
and local module example.

The generated identity is not proof of organizational ownership. The CLI does
not invent an Expo owner, EAS project ID, production API, authentication backend,
signing credentials, artwork, privacy policy, or store metadata. Continue with
[Configuration and Environments](./configuration.md) and
[Production Readiness](../operations/production-readiness.md).

## Repository and ref overrides

Use an exact ref for reproducible generation from a fork or mirror:

```bash
TEMPLATE_REPOSITORY=https://git.example.com/mobile/expo-app-template.git \
TEMPLATE_REF=v2.0.0 \
npx create-expo-app-template@latest customer-portal
```

GitHub repositories resolve their latest Release and fall back to `master` if
lookup fails. Non-GitHub mirrors use `master` when no explicit ref is set.
`GITHUB_TOKEN` or `GH_TOKEN` is used only for authenticated release lookup and
is never written to the generated project.

## GitHub template or direct clone

GitHub's **Use this template** action and a direct clone preserve source-template
identity intentionally. Follow [Configuration and Environments](./configuration.md)
before a production build.

## Source-template CLI maintenance

Generated projects remove `cli/`; this section applies only to the source
template. The CLI source and tests live under `cli/`:

```bash
pnpm test:cli
pnpm --dir cli pack
```

`pnpm test:ci` and the GitHub Release gate include CLI tests. Publish a template
GitHub Release before publishing a CLI version intended to consume it. Inspect
the npm archive before publishing, and keep CLI and application versions
independent.
