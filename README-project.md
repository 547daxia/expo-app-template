# Project Guide

This guide is copied into every app created from [Expo App Template](https://github.com/547daxia/expo-app-template). Replace the example identifiers and environment values with those for your app before creating builds.

## Requirements

- [React Native dev environment ](https://reactnative.dev/docs/environment-setup)
- [Node.js LTS release](https://nodejs.org/en/)
- [Git](https://git-scm.com/)
- [Watchman](https://facebook.github.io/watchman/docs/install#buildinstall), required only for macOS or Linux users
- [Pnpm](https://pnpm.io/installation)
- [Cursor](https://www.cursor.com/) or [VS Code Editor](https://code.visualstudio.com/download) ⚠️ Make sure to install all recommended extension from `.vscode/extensions.json`

## Dependency resolutions

`@isaacs/brace-expansion` is intentionally listed as a development dependency.
Expo SDK 56's Metro tooling resolves it at runtime under pnpm; keep it until the
upstream dependency tree no longer requires this explicit resolution.

## Current stack

- Expo SDK 56 / React Native 0.85 / React 19.2
- Expo Router and Continuous Native Generation (no committed `ios/` or `android/` projects)
- Uniwind with Tailwind CSS, TanStack Query, TanStack Form, Zod, and Zustand

## 👋 Quick start

Install dependencies from this checkout:

```sh
pnpm install
```

Start the development server:

```sh
pnpm start
```

Run a native development build:

```sh
pnpm ios
pnpm android
```

Use `pnpm start:preview` or `pnpm start:production` to select another environment. Run `pnpm check-all` before committing changes, and `pnpm doctor` after changing Expo-managed dependencies.

## First-time ownership checklist

Before creating an EAS build or publishing this repository, replace the example app identifiers and `package.json` repository URL, then configure your Expo owner, slug, and newly created EAS project ID. Copy `.env.example` to `.env` for local configuration.

See [First Project Setup](docs/src/content/docs/getting-started/first-project-setup.mdx) for the complete, ordered handoff checklist.

## Further reading

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router documentation](https://docs.expo.dev/router/introduction/)
- [React Native documentation](https://reactnative.dev/docs/getting-started)
- [Template repository](https://github.com/547daxia/expo-app-template)
