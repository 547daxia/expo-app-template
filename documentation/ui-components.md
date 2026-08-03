# UI Components

Shared primitives are exported from [`src/components/ui/`](../src/components/ui/). Keep feature-specific components inside their feature until they are reused by multiple features without feature-owned logic.

## Button

`Button` extends React Native `Pressable` and accepts `label`, `loading`, `variant`, `size`, `fullWidth`, and normal pressable props. It disables press handling while loading.

```tsx
import { Button } from '@/components/ui';

export function SaveButton() {
  return <Button label="Save" variant="secondary" onPress={() => {}} />;
}
```

Available variants are `default`, `secondary`, `outline`, `destructive`, `ghost`, and `link`; sizes are `sm`, `default`, `lg`, and `icon`.

## Input and Select

`Input` adds `label`, `error`, and `disabled` to native `TextInput` props. `Select` renders a bottom-sheet selector and accepts `{ label, value, options, onSelect, placeholder, disabled, error }`.

```tsx
import { Input, Select, View } from '@/components/ui';

const options = [{ label: 'Personal', value: 'personal' }];

export function ProfileFields() {
  return (
    <View>
      <Input label="Name" value="" onChangeText={() => {}} />
      <Select label="Account type" options={options} onSelect={() => {}} />
    </View>
  );
}
```

## Other primitives

- `Text`, `View`, `ScrollView`, `Pressable`, and `SafeAreaView` provide the shared styling baseline.
- `List` and `EmptyList` support list screens and loading/empty states.
- `Image` wraps Expo Image behavior.
- `Modal` and `useModal` expose the shared bottom-sheet modal pattern.
- `Checkbox`, `ProgressBar`, `FocusAwareStatusBar`, and icon exports cover common controls.

Use `testID` on interactive components so Jest and Maestro tests can address them reliably.
