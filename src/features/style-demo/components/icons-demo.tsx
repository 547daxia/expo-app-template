import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';

import { colors, Text, View } from '@/components/ui';

import { Title } from './title';

export function Icons() {
  return (
    <>
      <Title text="Icons" />
      <Text className="pb-3 text-neutral-600 dark:text-neutral-300">
        @expo/vector-icons provides consistent, accessible UI icons.
      </Text>
      <View className="flex-row flex-wrap gap-3">
        <IconPreview label="Feed">
          <Ionicons
            accessibilityLabel="Feed"
            color={colors.primary[500]}
            name="newspaper-outline"
            size={24}
          />
        </IconPreview>
        <IconPreview label="Favorite">
          <Ionicons
            accessibilityLabel="Favorite"
            color={colors.primary[500]}
            name="heart-outline"
            size={24}
          />
        </IconPreview>
        <IconPreview label="Share">
          <Ionicons
            accessibilityLabel="Share"
            color={colors.primary[500]}
            name="share-outline"
            size={24}
          />
        </IconPreview>
        <IconPreview label="Settings">
          <Ionicons
            accessibilityLabel="Settings"
            color={colors.primary[500]}
            name="settings-outline"
            size={24}
          />
        </IconPreview>
      </View>
    </>
  );
}

function IconPreview({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <View className="w-20 items-center rounded-md border border-neutral-200 py-3 dark:border-neutral-700">
      {children}
      <Text className="pt-2 text-sm" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}
