import type { ReactNode } from 'react';

import { ChevronRightIcon, Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';

type SettingsItemProps = {
  icon?: ReactNode;
  onPress?: () => void;
  text: string;
  value?: string;
};

export function SettingsItem({
  icon,
  onPress,
  text,
  value,
}: SettingsItemProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      className="min-h-12 flex-row items-center justify-between gap-3 px-4 py-3"
      disabled={!onPress}
      onPress={onPress}
    >
      <View className="flex-1 flex-row items-center gap-3">
        {icon}
        <Text selectable={!onPress}>{text}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        {value && <Text selectable className="text-muted-foreground">{value}</Text>}
        {onPress && <Icon as={ChevronRightIcon} className="text-muted-foreground" size="sm" />}
      </View>
    </Pressable>
  );
}
