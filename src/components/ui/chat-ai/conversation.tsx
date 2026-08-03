import type {
  LegendListRef,
  LegendListRenderItemProps,
} from '@legendapp/list/react-native';
import type { AnimatedLegendListProps } from '@legendapp/list/reanimated';
import type { UIMessage } from 'ai';
import type { ReactElement } from 'react';

import { AnimatedLegendList } from '@legendapp/list/reanimated';
import { ArrowDown, Download, MessageSquare } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef } from 'react';
import { Platform, Share, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { BlankProvider, useBlankContext } from './blank-context';
import { Message, MessageContent, MessageResponse } from './message';

export type ConversationProps = React.PropsWithChildren<{ className?: string }>;

export function Conversation({ children, className }: ConversationProps) {
  return (
    <BlankProvider>
      <View className={`flex-1 bg-background px-4 ${className || ''}`}>
        {children}
      </View>
    </BlankProvider>
  );
}

export type ConversationEmptyStateProps = {
  title?: string;
  description?: string;
  icon?: ReactElement;
  className?: string;
};

export function ConversationEmptyState({
  title = 'Start a conversation',
  description = 'Type a message below to begin chatting',
  icon,
  className,
}: ConversationEmptyStateProps) {
  return (
    <View
      className={`flex-1 items-center justify-center px-10 py-12 ${className || ''}`}
    >
      {icon ?? <MessageSquare size={48} className="text-muted-foreground" />}
      <Text className="mt-4 text-xl font-semibold text-foreground">{title}</Text>
      <Text className="mt-2 text-center text-base text-muted-foreground">
        {description}
      </Text>
    </View>
  );
}

export type ConversationContentProps = {
  messages: UIMessage[];
  renderItem?: (props: LegendListRenderItemProps<UIMessage>) => React.ReactNode;
  estimatedItemSize?: number;
} & Omit<AnimatedLegendListProps<UIMessage>, 'data' | 'renderItem'>;

export function ConversationContent({
  messages,
  renderItem,
  estimatedItemSize = 140,
  recycleItems = true,
  ...flatListProps
}: ConversationContentProps) {
  const flatListRef = useRef<LegendListRef>(null);

  const defaultRenderItem = useCallback(
    ({ item: message, index }: LegendListRenderItemProps<UIMessage>) => (
      <Message role={message.role} index={index} message={message}>
        <MessageContent>
          <MessageResponse message={message} />
        </MessageContent>
      </Message>
    ),
    [],
  );

  const prevLengthRef = useRef(messages.length);

  useEffect(() => {
    const shouldScroll
      = messages.length > prevLengthRef.current
        && messages[messages.length - 1].role === 'user';

    if (shouldScroll && Platform.OS !== 'web') {
      flatListRef.current?.scrollToEnd?.();
    }
    prevLengthRef.current = messages.length;
  }, [messages]);

  const { messagesContainerHeight } = useBlankContext();

  return (
    <View
      className="flex-1"
      onLayout={(e) => {
        const height = e.nativeEvent.layout.height;
        messagesContainerHeight.value = height;
      }}
    >
      {messages.length === 0
        ? (
            <ConversationEmptyState />
          )
        : (
            <AnimatedLegendList
              ref={flatListRef}
              data={messages}
              keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem || defaultRenderItem}
              keyExtractor={item => item.id}
              scrollEventThrottle={16}
              estimatedItemSize={estimatedItemSize}
              recycleItems={recycleItems}
              {...flatListProps}
              ListFooterComponent={<ConversationBlankSpacer />}
            />
          )}
    </View>
  );
}

function ConversationBlankSpacer() {
  const { blankSize } = useBlankContext();
  const animatedStyle = useAnimatedStyle(() => ({ height: blankSize.value }));

  return <Animated.View aria-hidden style={animatedStyle} />;
}

export type ConversationScrollButtonProps = {
  onPress: () => void;
};

export function ConversationScrollButton({
  onPress,
}: ConversationScrollButtonProps) {
  return (
    <TouchableOpacity
      accessibilityLabel="Scroll to the latest message"
      accessibilityRole="button"
      onPress={onPress}
      className="absolute bottom-6 left-1/2 size-11 -translate-x-1/2 items-center justify-center rounded-full bg-primary shadow-lg"
    >
      <ArrowDown size={22} className="text-primary-foreground" />
    </TouchableOpacity>
  );
}

export type ConversationDownloadProps = {
  messages: UIMessage[];
  onDownload?: (markdown: string) => void | Promise<void>;
};

export function ConversationDownload({
  messages,
  onDownload,
}: ConversationDownloadProps) {
  const handleDownload = useCallback(async () => {
    const markdown = messages
      .map((msg) => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        const text = msg.parts
          ?.filter(p => p.type === 'text')
          .map(p => p.text)
          .join('\n');
        return `**${role}:**\n${text}`;
      })
      .join('\n\n');

    if (onDownload) {
      await onDownload(markdown);
      return;
    }

    await Share.share({
      message: markdown,
      title: 'Conversation',
    });
  }, [messages, onDownload]);

  return (
    <TouchableOpacity
      accessibilityLabel="Export conversation"
      accessibilityRole="button"
      onPress={() => void handleDownload()}
      className="absolute top-4 right-4 rounded-2xl bg-card p-3 shadow-sm"
    >
      <Download size={20} className="text-muted-foreground" />
    </TouchableOpacity>
  );
}
