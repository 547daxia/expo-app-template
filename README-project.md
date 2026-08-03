<h1 align="center">
  <img alt="logo" src="./assets/icon.png" width="124px" style="border-radius:10px"/><br/>
Mobile App </h1>

> This Project is based on [Obytes starter](https://starter.obytes.com)

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

Before creating an EAS build or publishing this repository, replace the template's Expo identifiers, EAS project ID, and `package.json` repository URL. Copy `.env.example` to `.env` for local configuration.

See [First Project Setup](docs/src/content/docs/getting-started/first-project-setup.mdx) for the complete, ordered handoff checklist.

## ✍️ Documentation

- [Rules and Conventions](https://starter.obytes.com/getting-started/rules-and-conventions/)
- [Project structure](https://starter.obytes.com/getting-started/project-structure)
- [Environment vars and config](https://starter.obytes.com/getting-started/environment-vars-config)
- [UI and Theming](https://starter.obytes.com/ui-and-theme/ui-theming)
- [Components](https://starter.obytes.com/ui-and-theme/components)
- [Forms](https://starter.obytes.com/ui-and-theme/Forms)
- [Data fetching](https://starter.obytes.com/guides/data-fetching)
- [Contribute to starter](https://starter.obytes.com/how-to-contribute/)
