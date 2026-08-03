# Expo App Template

[![Expo](https://img.shields.io/github/package-json/dependency-version/547daxia/expo-app-template/expo?label=Expo)](https://expo.dev/)
[![React Native](https://img.shields.io/github/package-json/dependency-version/547daxia/expo-app-template/react-native?label=React%20Native)](https://reactnative.dev/)
[![License](https://img.shields.io/github/license/547daxia/expo-app-template)](./LICENSE)

A production-ready Expo and React Native application template, focused on a solid developer experience, maintainable structure, and modern tooling.

Originally based on [obytes/react-native-template-obytes](https://github.com/obytes/react-native-template-obytes), with substantial upgrades and customizations for independent maintenance.

## What's included

- Expo SDK 56, React Native 0.85, React 19, and TypeScript
- Expo Router with Continuous Native Generation (CNG)
- Uniwind and Tailwind CSS for styling
- `@expo/vector-icons` for common UI icons, with `react-native-svg` retained for custom artwork
- TanStack Query, TanStack Form, Zod, and Zustand
- Development, preview, and production environment support
- ESLint, Husky, lint-staged, Jest, and Maestro end-to-end testing
- GitHub Actions workflows for checks, builds, and releases

## Create a project

Select **Use this template** on GitHub, then create a repository for your app. You can also clone this repository directly:

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

## Common commands

```sh
pnpm start                 # Start the Expo development server
pnpm ios                   # Run an iOS development build
pnpm android               # Run an Android development build
pnpm test                  # Run unit tests
pnpm check-all             # Run lint, types, tests, dependency checks, and Expo Doctor
pnpm doctor                # Run Expo Doctor
pnpm docs:build            # Build the browsable documentation site (after docs install)
```

## Contributing

Issues and pull requests are welcome. Please run `pnpm check-all` before opening a pull request.

## Credits and license

This project is independently maintained by [@547daxia](https://github.com/547daxia). It preserves the original project's MIT license and copyright notice; see [LICENSE](./LICENSE).
