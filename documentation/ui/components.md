# UI Components

**Applies to:** selecting, composing, and cataloging shared UI. Generation and
upgrade procedure belongs exclusively to
[Gluestack UI Maintenance](./gluestack-ui-maintenance.md).

## Ownership

| Location | Use it for |
| --- | --- |
| [`src/components/ui/`](../../src/components/ui/) | Replaceable Gluestack-generated primitives |
| `src/components/` | Reusable project-owned wrappers and compound components |
| `src/features/<feature>/components/` | Feature-only components |

Import every component from its explicit directory; there is no shared UI
barrel. A feature may use an unmodified primitive directly. Once reusable
styling, accessibility behavior, or composition is needed, create a named
component under `src/components/` instead of editing generated source.

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

## Composition and catalog

Gluestack controls use explicit compound parts. Compose labels, inputs, and
validation messages with `FormControl`, `Input`, and their children rather than
inventing generic `label` or `error` props.

Top-level directories in `src/components/ui/` are the generated inventory.
[`src/features/style-demo/`](../../src/features/style-demo/) is the interactive
catalog, and its inventory test compares `component-groups.ts` with the
filesystem. Update both whenever a generated directory is added or removed.

## Project-owned compound components

BottomSheet, DatePicker, DateTimePicker, ImageViewer, and Tabs live directly
under `src/components/`. Import their explicit directories; there are no old
path aliases or compatibility wrappers. Their native/Web behavior and tests are
owned by this project, independently of generated primitive updates.

DatePicker and DateTimePicker preserve controlled draft/Confirm/Cancel behavior.
The shared `CalendarContent` composes month navigation and a selectable day
grid inside the generated Calendar root. On Web the date dialog uses a portal
with focus containment, Escape dismissal, and explicit Confirm/Cancel actions.
BottomSheet re-provides its context inside the overlay host so portaled actions
can close the owning sheet. Web content contains focus and supports Escape.
ImageViewer and horizontal Tabs use FlashList. The Style Demo exercises all
five groups alongside the generated inventory.

## Data lists and icons

Use `FlashList` from `@shopify/flash-list` for project-owned scrollable data
lists. ESLint forbids `FlatList` from React Native and the generated FlatList
wrapper in app, feature, shared-component, and library code. Generated source
and the Style Demo retain upstream list primitives only for catalog coverage.

Prefer icons exported by `@/components/ui/icon` inside compound Gluestack
controls. Expo Router navigator icons may use the supplied `color` and `size`.

## Verification

Add focused tests beside project-owned behavior, preserve accessibility labels
and `testID` forwarding, run the normal quality checks, and inspect the Style
Demo on every affected platform. Generated source is excluded from coverage; project-owned compound components
and their tests participate in normal verification.
