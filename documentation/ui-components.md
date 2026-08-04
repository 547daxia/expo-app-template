# UI Components

The UI system has two shared layers:

- [`src/components/ui/`](../src/components/ui/) is the replaceable Gluestack
  generated layer.
- [`src/components/`](../src/components/) contains reusable project-owned
  wrappers and compound components.

Feature-only components live under `src/features/<feature>/components/`.
Import every component from its explicit directory; there is intentionally no
shared barrel file.

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

The root layout installs `GluestackUIProvider`. Generated primitives and
project-owned components should use the semantic classes defined in
[`src/global.css`](../src/global.css), such as `bg-background`,
`text-foreground`, `bg-primary`, and `border-border`, so both light and dark
themes remain consistent.

Top-level directories under `src/components/ui/` form the installed component
inventory. Most are upstream-generated groups; the transitional custom groups
listed below remain in the same inventory until they are extracted. The
[`StyleScreen`](../src/features/style-demo/style-screen.tsx) is the interactive
visual catalog for generated groups and important reusable project components.
Its generated inventory test compares
`component-groups.ts` with the filesystem, so every component group must remain
represented when directories are added or removed.

## Project-owned wrappers

Use an upstream primitive directly when its API already satisfies the call
site. When reusable styling, defaults, accessibility behavior, or composition
is needed, create a named component under `src/components/` that imports the
primitive:

```tsx
import type { ComponentProps } from 'react';

import { Button, ButtonText } from '@/components/ui/button';

type PrimaryButtonProps = ComponentProps<typeof Button> & {
  label: string;
};

export function PrimaryButton({ label, ...props }: PrimaryButtonProps) {
  return (
    <Button className="rounded-xl" action="primary" {...props}>
      <ButtonText>{label}</ButtonText>
    </Button>
  );
}
```

Do not edit generated files to implement project behavior. Deep customization
that cannot be composed must become an explicitly documented project-owned fork
under `src/components/`.

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
field and composes `DateTimePicker` internally. Its current
`src/components/ui/date-picker` location is transitional; move it to the
project-owned layer before refreshing the generated date/time components.

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

## Data lists

Use `FlashList` from `@shopify/flash-list` for project-owned scrollable data
lists. It is the template's single application-level list implementation and
is enforced by ESLint in routes, features, shared components, and libraries.

```tsx
import { FlashList } from '@shopify/flash-list';

<FlashList data={posts} renderItem={({ item }) => <PostCard {...item} />} />;
```

Do not import `FlatList` from `react-native` or
`@/components/ui/flat-list` in project-owned code. The generated UI layer and
Style Demo retain their native list primitives for upstream component coverage;
they are maintenance exceptions, not a pattern for feature code.

## Icons

Prefer icons exported from [`src/components/ui/icon/`](../src/components/ui/icon/)
so their size and semantic color work with compound Gluestack controls. Expo
Router tab icons may continue to use the `color` and `size` values supplied by
the navigator.

## Adding or changing components

- Add upstream primitives with a reviewed, explicit CLI version and review the
  generated diff.
- Do not manually edit files or add project tests/helpers under
  `src/components/ui/`.
- Keep reusable project-owned components in `src/components/<name>/`.
- Keep feature-specific behavior under `src/features/<feature>/components/`.
- Use kebab-case directory and file names.
- Preserve accessibility labels and `testID` values on interactive controls.
- Add focused tests beside project-owned behavior. Generated source is excluded
  from coverage.
- Run lint, TypeScript, focused tests, dependency checks, documentation build,
  and affected-platform Style Demo verification after an update.

The directory still contains transitional customizations from the completed
legacy UI migration. Do not add new exceptions. See
[Gluestack UI Maintenance](./gluestack-ui-maintenance.md) for the exact
ownership rules, current transition status, pinned generation commands, and
major-version upgrade procedure.

The previous template UI layer has been removed. Do not recreate
`src/components/legacy-ui/` or add imports through a legacy compatibility
directory.
