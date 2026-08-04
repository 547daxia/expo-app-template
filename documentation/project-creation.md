# Project Creation

## Requirements

Creating a project requires Node.js 22 or later, pnpm 10, and Git. The CLI
itself uses only Node.js built-in modules; it installs application dependencies
with the `pnpm` executable after generation.

## Maintained CLI

Create a project from the latest published template release:

```bash
npx create-expo-app-template@latest customer-portal
```

The project name must be a single directory name containing letters, numbers,
dots, underscores, or hyphens. Paths, whitespace, hidden-directory names, and
shell syntax are rejected. The target directory must not already exist.

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

These generated identifiers remove the source-template placeholders, but they
are not proof of organizational ownership. Replace them with the project's
chosen reverse-DNS namespace when required.

The CLI performs one transaction on a newly cloned directory:

1. Resolve the latest GitHub Release tag, falling back to `master` only when a
   release cannot be resolved.
2. Clone that ref without evaluating user input through a shell.
3. Replace app name, slug, schemes, bundle/package IDs, and Maestro script IDs.
4. Reset the application version and remove the source repository metadata.
5. Remove generated native projects and the template's CLI package, replace
   the marketing README with the project guide, and retain `LICENSE`,
   `documentation/`, `docs/`, `modules/`, project workflows, and application
   source.
6. Initialize a fresh Git repository with `main` as its initial branch.
7. Install application dependencies with pnpm.

The CLI deliberately does not invent an Expo owner, EAS project ID, production
API, authentication backend, signing credentials, artwork, privacy policy, or
store metadata. Complete [Configuration and Environments](./configuration.md)
and [Production Readiness](./production-readiness.md) after generation.

## Repository and ref overrides

Use an exact ref for reproducible generation from a fork or mirror:

```bash
TEMPLATE_REPOSITORY=https://git.example.com/mobile/expo-app-template.git \
TEMPLATE_REF=v2.0.0 \
npx create-expo-app-template@latest customer-portal
```

When `TEMPLATE_REPOSITORY` is not a GitHub repository and `TEMPLATE_REF` is
omitted, the CLI uses the mirror's `master` ref. Set both values for an
internal mirror so generation does not depend on GitHub's Release API.
`GITHUB_TOKEN` or `GH_TOKEN` is used only for authenticated GitHub release
lookup when present; it is never written to the generated project.

## GitHub template or direct clone

GitHub's **Use this template** action and a direct Git clone remain supported.
Those methods preserve the source-template identity intentionally; follow the
full ownership checklist in `documentation/configuration.md` before a
production build.

## Source template CLI maintenance

This section applies only to the source template repository. Generated projects
remove `cli/`, while retaining this page as provenance and creation guidance.
CLI source lives under `cli/`. Its Node test suite covers input validation,
identity transformation, release lookup, file ownership, literal command
arguments, the npm archive contract, and complete local-repository generation:

```bash
pnpm test:cli
pnpm --dir cli pack
```

`pnpm test:ci` and the GitHub Release gate include the CLI tests. Publish a
template GitHub Release before publishing a CLI version intended to consume
that release. Inspect the npm package archive before publishing, and keep the
CLI version independent from the generated application's version.
