# Fonts

The template bundles Inter through `@expo-google-fonts/inter` and configures its 400, 500, 600, and 700 weights in the `expo-font` plugin in [`app.config.ts`](../app.config.ts). The Tailwind font token is defined in [`src/global.css`](../src/global.css).

## Use the bundled font

Use the configured family through Tailwind classes or component styles:

```tsx
import { Text } from '@/components/ui';

export function Heading() {
  return <Text className="font-sans text-xl font-semibold">Heading</Text>;
}
```

## Add another native font

1. Install the font package with `pnpm exec expo install` when it is Expo-managed, or add local font files under `assets/`.
2. Add each required weight to the iOS and Android `expo-font` plugin configuration in `app.config.ts`.
3. Add or update the font token in `src/global.css`.
4. Run the relevant `pnpm prebuild:<environment>` command or create a new development build.

Do not expect a font added after an existing native build to appear until that build has been regenerated.
