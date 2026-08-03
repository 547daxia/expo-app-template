'use client';

import type { LayoutChangeEvent, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { useCallback } from 'react';
import { useAnimatedRef, useSharedValue } from 'react-native-reanimated';

export function useMessageHeight(targetHeight?: SharedValue<number>) {
  const internalHeight = useSharedValue(0);
  const heightToUse = targetHeight || internalHeight;

  const ref = useAnimatedRef<View>();

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      'worklet';
      heightToUse.value = event.nativeEvent.layout.height;
    },
    [heightToUse],
  );

  return {
    ref,
    onLayout,
    targetHeight: heightToUse,
  };
}
