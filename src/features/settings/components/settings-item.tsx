import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';

import { colors, Pressable, Text, View } from '@/components/ui';

type ItemProps = {
  text: string;
  value?: string;
  onPress?: () => void;
  icon?: React.ReactNode;
};

export function SettingsItem({ text, value, icon, onPress }: ItemProps) {
  const isPressable = onPress !== undefined;
  return (
    <Pressable
      onPress={onPress}
      pointerEvents={isPressable ? 'auto' : 'none'}
      className="flex-1 flex-row items-center justify-between px-4 py-2"
    >
      <View className="flex-row items-center">
        {icon && <View className="pr-2">{icon}</View>}
        <Text>{text}</Text>
      </View>
      <View className="flex-row items-center">
        <Text className="text-neutral-600 dark:text-white">{value}</Text>
        {isPressable && (
          <View className="pl-2">
            <Ionicons
              name="chevron-forward"
              color={colors.neutral[300]}
              size={18}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
}
