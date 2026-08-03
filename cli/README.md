# Create Expo App Template

This optional CLI creates a new project from a tagged release of this template.

## Usage

```sh
npx create-expo-app-template@latest MyApp
```

The CLI removes template-only files, initializes a fresh Git repository, and
updates the app identity placeholders. Before using EAS, complete the setup
steps in [`documentation/configuration.md`](../documentation/configuration.md).

To clone from a fork, set `TEMPLATE_REPOSITORY` to its GitHub repository URL.
The CLI will use its latest GitHub Release unless `TEMPLATE_REF` is set.

For an internal mirror, set both `TEMPLATE_REPOSITORY` and `TEMPLATE_REF` so
the CLI does not need GitHub's Release API:

```sh
TEMPLATE_REPOSITORY=https://git.example.com/mobile/expo-app-template \
TEMPLATE_REF=main \
npx create-expo-app-template@latest MyApp
```

## Development

Run the CLI locally with:

```sh
node cli/index.js MyApp
```

The generated project keeps the source template's development and preview demo
flows. Replace the demo authentication and API adapters before production.
