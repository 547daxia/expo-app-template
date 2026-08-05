# Fonts

**Applies to:** native font registration and Tailwind font tokens.

The template bundles Inter through `@expo-google-fonts/inter` and configures
its 400, 500, 600, and 700 weights in the `expo-font` plugin in
[`app.config.ts`](../../app.config.ts). Font tokens live in
[`src/global.css`](../../src/global.css).

Use the configured family through Tailwind classes or component styles:

```tsx
<Text className="font-sans text-xl font-semibold">Heading</Text>;
```

To add another font, install its package or add local files, register every
needed weight in the iOS and Android `expo-font` configuration, update the
Tailwind token, then create a new development build. A font added after an
existing native build will not appear until that build is regenerated.
