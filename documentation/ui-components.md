# UI Components

Shared UI lives in [`src/components/ui/`](../src/components/ui/) and is built
with Gluestack UI and Uniwind. Import each component from its own directory;
there is intentionally no shared barrel file.

```tsx
import { Button, ButtonText } from '@/components/ui/button';

export function SaveButton() {
  return (
    <Button onPress={save}>
      <ButtonText>Save</ButtonText>
    </Button>
  );
}
```

The root layout installs `GluestackUIProvider`. Reusable components should use
the semantic classes defined in [`src/global.css`](../src/global.css), such as
`bg-background`, `text-foreground`, `bg-primary`, and `border-border`, so both
light and dark themes remain consistent.

All 60 component directories currently installed under `src/components/ui/`
are part of the maintained shared library. The
[`StyleScreen`](../src/features/style-demo/style-screen.tsx) is the interactive
visual catalog for that library. Its inventory test compares
`component-groups.ts` with the filesystem, so every component group must remain
represented when directories are added or removed.

## Compound components

Gluestack controls are composed from explicit parts. For example, an input with
a label and validation message uses `FormControl`, `Input`, and their child
components rather than custom `label` or `error` props:

```tsx
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';

export function EmailField({ error }: { error?: string }) {
  return (
    <FormControl isInvalid={Boolean(error)}>
      <FormControlLabel>
        <FormControlLabelText>Email</FormControlLabelText>
      </FormControlLabel>
      <Input>
        <InputField keyboardType="email-address" />
      </Input>
      {error && (
        <FormControlError>
          <FormControlErrorText>{error}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}
```

## Date picker

`DatePicker` is the retained convenience wrapper for the common controlled-date
field. It now lives alongside the Gluestack components and composes the shared
`DateTimePicker` internally.

```tsx
import * as React from 'react';

import { DatePicker } from '@/components/ui/date-picker';

const today = new Date();

export function BirthdayField() {
  const [birthday, setBirthday] = React.useState(() => new Date());

  return (
    <DatePicker
      label="Birthday"
      value={birthday}
      maximumDate={today}
      onChange={setBirthday}
      testID="birthday"
    />
  );
}
```

Use `DateTimePicker` directly when a screen needs time or date-time modes. Native
picker appearance follows platform defaults; Android resource-level color
changes require the `@react-native-community/datetimepicker` Expo config plugin
and a rebuilt native app.

On every platform, picker changes remain a draft until the user presses
Confirm/Done. Cancel closes the picker without changing the controlled value.

## Chat AI

The supported chat API is composed from `Conversation`, `Message`, and
`PromptInput` under `src/components/ui/chat-ai/`. Keep message state and model
transport in the owning feature; the shared components only provide rendering,
attachments, input behavior, and conversation layout. The removed legacy
`Chat`, `ChatMessages`, and `useChat` APIs must not be reintroduced.

## Icons

Prefer icons exported from [`src/components/ui/icon/`](../src/components/ui/icon/)
so their size and semantic color work with compound Gluestack controls. Expo
Router tab icons may continue to use the `color` and `size` values supplied by
the navigator.

## Adding or changing components

- Start upstream additions with
  `pnpm dlx gluestack-ui@latest add <component>` and review the generated diff.
- Keep reusable, feature-independent primitives in `src/components/ui/<name>/`.
- Keep feature-specific behavior under `src/features/<feature>/components/`.
- Use kebab-case directory and file names.
- Preserve accessibility labels and `testID` values on interactive controls.
- Add focused tests for custom components and behavior. Gluestack CLI-generated
  source is excluded from coverage, but the custom chat, date-picker,
  date-time-picker, image-viewer, and tabs layers are included.
- Run lint, TypeScript, and focused tests after generating or updating a
  Gluestack component.

The previous template UI layer has been removed. Do not recreate a second UI
abstraction or add imports through a legacy compatibility directory.
