# UI and Theming

**Applies to:** shared styling, theme selection, and the UI ownership model.

Uniwind maps Tailwind v4 utility classes to React Native styles. The shared
theme lives in [`src/global.css`](../../src/global.css), including Inter font
families, semantic colors, status palettes, and light/dark values.

`useSelectedTheme` persists the user's `light`, `dark`, or `system` preference
in MMKV; `loadSelectedTheme()` restores it before the root layout renders.
`GluestackUIProvider` keeps overlays and its mode aligned with the navigation
theme. Use `useUniwind()` only when a component needs a runtime styling decision.

## Choose the right guide

- [UI Components](./components.md): generated primitives, project-owned
  wrappers, the Style Demo, icons, and data-list rules.
- [Gluestack UI Maintenance](./gluestack-ui-maintenance.md): generation,
  upgrades, transition status, and verification.
- [Forms](./forms.md): TanStack Form, Zod, validation feedback, and keyboards.
- [Fonts](./fonts.md): Inter configuration and native rebuild requirements.

Use semantic classes such as `bg-background`, `text-foreground`, `bg-primary`,
and `border-border` so light and dark themes stay consistent.
