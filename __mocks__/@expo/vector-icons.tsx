import * as React from 'react';
import { Text } from 'react-native';

type IconProps = {
  accessibilityLabel?: string;
  name: string;
  testID?: string;
};

export function Ionicons({
  accessibilityLabel,
  name,
  testID,
}: IconProps) {
  return (
    <Text accessibilityLabel={accessibilityLabel ?? name} testID={testID}>
      {name}
    </Text>
  );
}
