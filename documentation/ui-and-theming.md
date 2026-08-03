# UI and Theming

## Styling

Uniwind maps Tailwind utility classes to React Native styles. The shared theme is defined in [`src/global.css`](../src/global.css), including Inter fonts, neutral/primary palettes, semantic colors, and dark-mode values.

Prefer shared primitives from [`src/components/ui/`](../src/components/ui/) such as `View`, `Text`, `Button`, `Input`, `Select`, `Modal`, `List`, and `Checkbox`. Promote a component to this directory only when it is reusable across features and has no feature-specific behavior.

## Theme lifecycle

`useSelectedTheme` stores the user's `light`, `dark`, or `system` choice in MMKV and applies it through Uniwind. `loadSelectedTheme()` runs before the root layout renders so the selected theme is restored during startup. Use `useUniwind()` for styling decisions inside components.

## Forms

Use TanStack Form with a Zod schema. Bind fields to `Input` or `Select`, pass validation feedback through `getFieldError`, and subscribe only to the form state needed by a control. See [Forms](./forms.md) for an implementation pattern.

## Adding fonts

Fonts are configured through the `expo-font` plugin in [`app.config.ts`](../app.config.ts). After changing native font configuration, run the appropriate `prebuild` command and verify the generated development build.

## References

- [UI Components](./ui-components.md): shared primitive contracts and examples
- [Forms](./forms.md): validation, submission, and keyboard patterns
- [Fonts](./fonts.md): Inter setup and adding native or local fonts
