# Create Expo App Template

Create a new application from a tagged Expo App Template release.

## Requirements

- Node.js 22 or later
- pnpm 10 on `PATH`
- Git

## Usage

```sh
npx create-expo-app-template@latest customer-portal
```

The command creates only a new direct child of the current directory. It
validates the project name, clones a release, derives application identity,
updates local Maestro scripts and Android Maestro workflow IDs, initializes a
fresh `main` branch, and installs dependencies. Git and pnpm receive literal
argument arrays; project input is never evaluated by a shell.

The generated project retains the license, canonical documentation, documentation
site, workflows, local module, and application source. It removes the template
CLI, generated native directories, original Git history, and template marketing
README.

For generated-project setup, ownership, exact identity derivation, mirrors,
template maintenance, and release order, read the canonical
[Project Creation guide](../documentation/getting-started/project-creation.md).

## Forks and mirrors

```sh
TEMPLATE_REPOSITORY=https://git.example.com/mobile/expo-app-template.git \
TEMPLATE_REF=v2.0.0 \
npx create-expo-app-template@latest customer-portal
```

Without `TEMPLATE_REF`, GitHub repositories resolve their latest Release and
fall back to `master`; non-GitHub mirrors use `master`. Set an explicit ref for
reproducible generation.

## Development

```sh
node cli/index.js customer-portal
pnpm test:cli
pnpm --dir cli pack
```
