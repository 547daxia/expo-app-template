'use client';

import { useAnimatedReaction } from 'react-native-reanimated';
import { useBlankContext } from './blank-context';
import { useMessageHeight } from './use-message-height';

type UseMessageBlankSizeOptions = {
  disabled?: boolean;
  role: 'user' | 'assistant' | 'system';
};

export function useBlankSize({
  disabled = false,
  role,
}: UseMessageBlankSizeOptions) {
  const context = useBlankContext();
  if (!context) {
    throw new Error('useMessageBlankSize must be used inside Chat');
  }

  const targetHeight
    = role === 'user'
      ? context.userMessageHeight
      : context.assistantMessageHeight;
  const { ref, onLayout } = useMessageHeight(targetHeight);

  useAnimatedReaction(
    () => ({
      message: targetHeight.value,
      container: context.messagesContainerHeight.value,
      disabled,
    }),
    ({ message, container, disabled: isDisabled }) => {
      'worklet';
      if (!isDisabled) {
        context.blankSize.value = Math.max(0, container - message - 46);
      }
    },
  );

  return { ref, onLayout };
}
