# Expo App Template

[![Expo](https://img.shields.io/github/package-json/dependency-version/547daxia/expo-app-template/expo?label=Expo)](https://expo.dev/)
[![React Native](https://img.shields.io/github/package-json/dependency-version/547daxia/expo-app-template/react-native?label=React%20Native)](https://reactnative.dev/)
[![License](https://img.shields.io/github/license/547daxia/expo-app-template)](./LICENSE)

A production-ready Expo and React Native application template focused on
maintainable structure, typed configuration, and reliable developer workflow.

## Create a project

```sh
npx create-expo-app-template@latest customer-portal
cd customer-portal
cp .env.example .env
pnpm start
```

You can also use GitHub's template action or clone this repository directly.
Those routes retain template identity until you complete
[Configuration and Environments](./documentation/getting-started/configuration.md).

## Common commands

```sh
pnpm start
pnpm ios
pnpm android
pnpm test
pnpm test:ci
pnpm check-all
pnpm doctor
pnpm docs:check
pnpm docs:build
```

Run `pnpm --dir docs install` once before the first documentation-site build.
Use `pnpm docs:dev` to browse the local site.

## Documentation

[`documentation/`](./documentation/README.md) is the canonical operational
source for project setup, architecture, UI ownership, testing, and releases.
[`docs/`](./docs/README.md) is its Starlight presentation layer; it imports the
canonical Markdown during build so search and AI-facing `llms.txt` contain the
same guidance.

Start with [Project Creation](./documentation/getting-started/project-creation.md)
or [Development Workflow](./documentation/getting-started/development.md).
Before a store release, complete
[Production Readiness](./documentation/operations/production-readiness.md).

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md), run `pnpm check-all`, and update the
relevant canonical document when behavior changes. Shared UI changes must keep
the Style Demo inventory synchronized and follow
[Gluestack UI Maintenance](./documentation/ui/gluestack-ui-maintenance.md).

## Credits and license

Originally based on [obytes/react-native-template-obytes](https://github.com/obytes/react-native-template-obytes),
this repository is independently maintained by [@547daxia](https://github.com/547daxia).
It preserves the original MIT license and copyright notice; see [LICENSE](./LICENSE).
