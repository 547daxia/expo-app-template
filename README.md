# Expo App Template

[![Expo](https://img.shields.io/github/package-json/dependency-version/547daxia/expo-app-template/expo?label=Expo)](https://expo.dev/)
[![React Native](https://img.shields.io/github/package-json/dependency-version/547daxia/expo-app-template/react-native?label=React%20Native)](https://reactnative.dev/)
[![License](https://img.shields.io/github/license/547daxia/expo-app-template)](./LICENSE)

A production-ready Expo and React Native application template, focused on a solid developer experience, maintainable structure, and modern tooling.

Originally based on [obytes/react-native-template-obytes](https://github.com/obytes/react-native-template-obytes), with substantial upgrades and customizations for independent maintenance.

## What's included

- Expo SDK 56, React Native 0.85, React 19, and TypeScript
- Expo Router with Continuous Native Generation (CNG)
- A replaceable Gluestack-generated UI layer plus project-owned components,
  styled with Uniwind and Tailwind CSS
- A Style Demo catalog covering installed generated groups and reusable project UI
- Gluestack SVG icons for shared controls and `@expo/vector-icons` for navigator icons
- FlashList as the standard for project-owned scrollable data lists
- TanStack Query, TanStack Form, Zod, and Zustand
- SecureStore for native credentials and MMKV for non-sensitive preferences
- Development, preview, and production environment support
- ESLint, Husky, lint-staged, Jest, and Maestro end-to-end testing
- GitHub Actions workflows for checks, builds, and releases
- A maintained, shell-safe CLI for creating isolated projects from template releases
- A minimal local Expo Module with Android, iOS, and Web implementations

## Create a project

The maintained CLI creates an isolated project from the latest template
release, applies a safe initial identity, initializes Git, and installs
dependencies:

```sh
npx create-expo-app-template@latest customer-portal
cd customer-portal
cp .env.example .env
pnpm start
```

You can also select **Use this template** on GitHub or clone the repository
directly. Those methods preserve the template identity until you replace it:

```sh
git clone https://github.com/547daxia/expo-app-template.git my-app
cd my-app
pnpm install
cp .env.example .env
pnpm start
```

Before creating an EAS build or update, configure the following values for your app:

- `EXPO_SLUG`
- `EXPO_ACCOUNT_OWNER`
- `EAS_PROJECT_ID`
- app name, scheme, bundle identifier, Android package, and API URL

See [README-project.md](./README-project.md) for the project setup and daily development commands.

Project structure and operational guidance are indexed in [documentation/Readme.md](./documentation/Readme.md). The browsable Astro/Starlight documentation source remains under [docs/](./docs/).
Use the [production readiness checklist](./documentation/production-readiness.md)
before the first store release.

## Common commands

```sh
pnpm start                 # Start the Expo development server
pnpm ios                   # Run an iOS development build
pnpm android               # Run an Android development build
pnpm test                  # Run unit tests
pnpm test:ci               # Run Jest coverage and CLI generator tests
pnpm test:cli              # Run maintained project-generator tests
pnpm audit:prod            # Audit production dependencies
pnpm audit:ci              # Audit production and high-severity tooling issues
pnpm check-all             # Run lint, types, coverage, audits, Expo checks, and Doctor
pnpm doctor                # Run Expo Doctor
pnpm docs:build            # Build the browsable documentation site (after docs install)
```

## Contributing

Issues and pull requests are welcome. Please run `pnpm check-all` before opening a pull request.
When shared UI changes, also verify the Style tab and keep its generated
component inventory in sync. Follow the
[Gluestack maintenance guide](./documentation/gluestack-ui-maintenance.md) before
adding, regenerating, or upgrading UI primitives.
Changes under `cli/` must keep `pnpm test:cli` green and preserve the generated
project contract in [Project Creation](./documentation/project-creation.md).

Production configuration always fails closed and rejects the template app name,
`com.example.*` identifiers, non-HTTPS API URLs, and the DummyJSON demo endpoint.
Configure project-owned identity, API,
authentication, EAS ownership, credentials, and store metadata before release.
The Style Demo is intentionally part of the production application and should
remain covered by the component inventory test.

## Credits and license

This project is independently maintained by [@547daxia](https://github.com/547daxia). It preserves the original project's MIT license and copyright notice; see [LICENSE](./LICENSE).
