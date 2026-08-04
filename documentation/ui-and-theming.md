# UI and Theming

## Styling

Uniwind maps Tailwind v4 utility classes to React Native styles. The shared
theme is defined in [`src/global.css`](../src/global.css), including Inter font
families, custom text/tracking tokens, neutral/status palettes, semantic colors,
and dark-mode values.

Import unmodified Gluestack primitives from their generated component
directories, for example `@/components/ui/button` or `@/components/ui/input`.
Reusable project defaults and behavior belong in named wrappers under
`src/components/`; feature-specific UI remains inside its feature. There is no
UI barrel export or legacy compatibility directory. Installed generated groups
and reusable project components are represented in the Style Demo as
appropriate.

## Theme lifecycle

`useSelectedTheme` stores the user's `light`, `dark`, or `system` choice in MMKV and applies it through Uniwind. `loadSelectedTheme()` runs before the root layout renders so the selected theme is restored during startup. `GluestackUIProvider` supplies overlay/toast infrastructure and keeps its mode aligned with the navigation theme. Use `useUniwind()` for styling decisions inside components.

## Forms

Use TanStack Form with a Zod schema. Compose fields with `FormControl` and the
relevant Gluestack input, obtain validation feedback from
`@/lib/form-utils`, and subscribe only to the form state needed by a control.
See [Forms](./forms.md) for an implementation pattern.

## Adding fonts

Fonts are configured through the `expo-font` plugin in [`app.config.ts`](../app.config.ts). After changing native font configuration, run the appropriate `prebuild` command and verify the generated development build.

## References

- [UI Components](./ui-components.md): shared primitive contracts and examples
- [Gluestack UI Maintenance](./gluestack-ui-maintenance.md): generated-source ownership and upgrades
- [Forms](./forms.md): validation, submission, and keyboard patterns
- [Fonts](./fonts.md): Inter setup and adding native or local fonts
