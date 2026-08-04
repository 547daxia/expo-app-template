# Create Expo App Template

This maintained CLI creates a new application from a tagged release of Expo App
Template.

## Requirements

- Node.js 22 or later
- pnpm 10 available on `PATH`
- Git

## Usage

```sh
npx create-expo-app-template@latest customer-portal
```

The command only writes to a new, direct child of the current directory. It
validates the project name, clones the latest GitHub Release, updates the app
identity and E2E identifiers, initializes a fresh `main` branch, and installs
dependencies. Git and pnpm receive argument arrays directly; project input is
never evaluated by a shell.

The generated project retains the MIT license, operational Markdown,
documentation website, application workflows, and source. It removes the
template CLI, generated native directories, original Git history, and
template marketing README.

The CLI does not configure a backend, authentication service, Expo/EAS account,
credentials, or store metadata. Follow the generated project's
`documentation/configuration.md` and
`documentation/production-readiness.md` before a production build.

## Forks and mirrors

Use an exact ref when cloning from a fork or internal mirror:

```sh
TEMPLATE_REPOSITORY=https://git.example.com/mobile/expo-app-template.git \
TEMPLATE_REF=v2.0.0 \
npx create-expo-app-template@latest customer-portal
```

Without `TEMPLATE_REF`, GitHub repositories resolve their latest Release and
fall back to `master` if lookup fails. Non-GitHub mirrors use `master`; set an
explicit ref for deterministic generation.

## Development

Run the current checkout locally:

```sh
node cli/index.js customer-portal
pnpm test:cli
pnpm --dir cli pack
```

See the
[project creation and CLI maintenance guide](https://github.com/547daxia/expo-app-template/blob/master/documentation/project-creation.md)
for the generation contract, derived identity table, maintenance rules, and
release order.
