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

## Icons

Use [`@expo/vector-icons`](https://docs.expo.dev/guides/icons/) for standard navigation, action, and status icons. Import the family you need directly; the template uses `Ionicons` for its tabs, settings items, and select affordances.

```tsx
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/components/ui';

export function FavoriteButton() {
  return (
    <Ionicons
      accessibilityLabel="Favorite"
      color={colors.primary[500]}
      name="heart-outline"
      size={24}
    />
  );
}
```

For a tab icon, use the `color` and `size` supplied by Expo Router:

```tsx
tabBarIcon: ({ color, size }) => (
  <Ionicons name="settings-outline" color={color} size={size} />
);
```

`react-native-svg` remains part of the template for custom shapes and illustrations, including the checkbox, select checkmark, empty states, and onboarding cover. Do not add a custom SVG component for a common UI icon that exists in `@expo/vector-icons`; reserve SVG for brand artwork or a genuinely custom visual.

## Other primitives

- `Text`, `View`, `ScrollView`, `Pressable`, and `SafeAreaView` provide the shared styling baseline.
- `List` and `EmptyList` support list screens and loading/empty states.
- `Image` wraps Expo Image behavior.
- `Modal` and `useModal` expose the shared bottom-sheet modal pattern.
- `Checkbox`, `ProgressBar`, and `FocusAwareStatusBar` cover common controls.

Use `testID` on interactive components so Jest and Maestro tests can address them reliably.
