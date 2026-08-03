import type { UIMessage } from 'ai';
import type { ViewStyle } from 'react-native';
import type { ASTNode, RenderRules } from 'react-native-markdown-display';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Music2,
  Paperclip,
  Video,
} from 'lucide-react-native';
import React, {
  createContext,
  memo,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,

} from 'react-native';
import Markdown from 'react-native-markdown-display';
import Animated from 'react-native-reanimated';
import { useBlankSize } from './use-blank';
import { useUserMessageAnimation } from './user-animation';

type MessageContextType = {
  role: UIMessage['role'];
  message?: UIMessage;
};

const MessageContext = createContext<MessageContextType | null>(null);

function useMessageContext() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error(
      'MessageToolbar and other children must be used inside <Message>',
    );
  }
  return context;
}

function mergeRefs<T,>(...refs: Array<React.Ref<T> | null | undefined>): React.RefCallback<T> {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      }
      else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
}

export type MessageProps = {
  role: UIMessage['role'];
  children: React.ReactNode;
  className?: string;
  index: number;
  message: UIMessage;
};

export type MessageContentProps = {
  children: React.ReactNode;
  className?: string;
};

export const Message = memo(
  ({ role, children, className, index, message }: MessageProps) => {
    const isUserFirstMessage = index === 0;

    const {
      style: animationStyle,
      ref: animRef,
      onLayout: animOnLayout,
    } = useUserMessageAnimation({ disabled: !isUserFirstMessage });

    const { ref: blankRef, onLayout: blankOnLayout } = useBlankSize({
      role,
      disabled: !isUserFirstMessage,
    });

    const combinedRef = useMemo(
      () => mergeRefs(animRef, blankRef),
      [animRef, blankRef],
    );

    const contextValue = useMemo(() => ({ role, message }), [role, message]);

    if (role === 'user') {
      return (
        <MessageContext.Provider value={contextValue}>
          <Animated.View
            ref={combinedRef}
            onLayout={(event) => {
              animOnLayout?.(event);
              blankOnLayout?.(event);
            }}
            style={animationStyle as ViewStyle}
            className={`group mt-4 flex w-full max-w-[95%] flex-col gap-2 ${className || ''}`}
          >
            {children}
          </Animated.View>
        </MessageContext.Provider>
      );
    }

    return (
      <MessageContext.Provider value={contextValue}>
        <Animated.View
          ref={blankRef}
          onLayout={blankOnLayout}
          className={`group flex w-full max-w-[95%] flex-col gap-2 ${className || ''}`}
        >
          {children}
        </Animated.View>
      </MessageContext.Provider>
    );
  },
);

export const MessageContent = memo(
  ({ children, className }: MessageContentProps) => {
    const { role } = useMessageContext();

    const roleStyles
      = role === 'user' ? 'self-end bg-muted max-w-[90%] px-4' : 'self-start ';

    return (
      <View
        className={`flex w-fit min-w-0 flex-col justify-center gap-2 overflow-hidden rounded-3xl py-3 text-base ${roleStyles} ${className || ''}`}
      >
        {children}
      </View>
    );
  },
);

export const MessageResponse = memo(({ message }: { message: UIMessage }) => {
  const markdownRules: RenderRules = {
    text: (node: ASTNode) => {
      return (
        <Text key={node.key} className="text-lg text-foreground">
          {node.content}
        </Text>
      );
    },

    ordered_list: (node: ASTNode, children: React.ReactNode[]) => {
      return (
        <View key={node.key} className="mb-2">
          {children}
        </View>
      );
    },

    list_item: (
      node: ASTNode,
      children: React.ReactNode[],
      parentNodes: ASTNode[],
    ) => {
      const isOrdered = parentNodes.at(-1)?.type === 'ordered_list';
      const index = node.index ?? 0;
      return (
        <View key={node.key} className="mb-1 flex-row items-start">
          <Text className="mr-2 text-foreground">
            {isOrdered ? `${index + 1}.` : '•'}
          </Text>
          <View className="flex-1">
            <View className="flex-1">{children}</View>
          </View>
        </View>
      );
    },

    paragraph: (node: ASTNode, children: React.ReactNode[]) => {
      return (
        <View key={node.key} className="">
          {children}
        </View>
      );
    },

    strong: (node: ASTNode, children: React.ReactNode[]) => (
      <Text key={node.key} className="font-bold text-foreground">
        {children}
      </Text>
    ),

    em: (node: ASTNode, children: React.ReactNode[]) => (
      <Text key={node.key} className="text-foreground italic">
        {children}
      </Text>
    ),

    fence: (node: ASTNode) => (
      <View key={node.key} className="my-2 rounded-xl bg-muted p-3">
        <Text className="font-mono text-sm text-white">{node.content}</Text>
      </View>
    ),

    code_block: (node: ASTNode) => (
      <View className="my-2 rounded-xl bg-slate-900 p-3" key={node.key}>
        <Text className="font-mono text-sm text-white">{node.content}</Text>
      </View>
    ),

    code_inline: (node: ASTNode) => (
      <Text
        key={node.key}
        className="rounded-sm bg-slate-800 px-1 py-0.5 text-white"
      >
        {node.content}
      </Text>
    ),
  };

  const hasText = message.parts.some(p => p.type === 'text');
  const hasFile = message.parts.some(p => p.type === 'file');

  if (!hasText && !hasFile) {
    return <Text className="text-muted-foreground">Thinking...</Text>;
  }

  return (
    <View className="gap-2">
      {message.parts.map((part, index) => {
        if (part.type === 'text') {
          return (
            <Markdown key={index} rules={markdownRules}>
              {part.text || ''}
            </Markdown>
          );
        }

        if (part.type === 'file') {
          if (!part.url)
            return null;

          const mediaType = part.mediaType ?? '';
          if (mediaType.startsWith('image/')) {
            return (
              <Image
                key={index}
                accessibilityLabel={part.filename ?? 'Attached image'}
                source={{ uri: part.url }}
                className="mt-1.5 size-40 rounded-xl"
                resizeMode="cover"
              />
            );
          }

          const FileIcon = mediaType.startsWith('video/')
            ? Video
            : mediaType.startsWith('audio/')
              ? Music2
              : mediaType
                ? FileText
                : Paperclip;

          return (
            <View
              key={index}
              className="mt-1.5 flex-row items-center gap-2 rounded-xl border border-border bg-muted p-3"
            >
              <FileIcon className="text-muted-foreground" size={20} />
              <Text className="flex-1 text-foreground" numberOfLines={2}>
                {part.filename ?? 'Attachment'}
              </Text>
            </View>
          );
        }

        return null;
      })}
    </View>
  );
});

export type MessageToolbarProps = {
  children: React.ReactNode;
  className?: string;
  message?: UIMessage;
};

export const MessageToolbar = memo(
  ({ children, className }: MessageToolbarProps) => {
    const { role, message } = useMessageContext();

    const roleStyles = role === 'user' ? 'self-end' : 'self-start';
    const hasText = message?.parts?.some(
      p => p.type === 'text' && p.text?.length > 0,
    );

    if (!hasText)
      return null;

    if (role === 'user')
      return null;

    return (
      <View
        className={`-mt-4 ml-2 flex-row items-center gap-3 ${roleStyles} ${className || ''}`}
      >
        {children}
      </View>
    );
  },
);

export function MessageAction({
  onPress,
  tooltip,
  children,
}: {
  onPress?: () => void;
  tooltip?: string;
  children: React.ReactNode;
}) {
  const handlePress = () => {
    if (tooltip)
      Alert.alert(tooltip);
    onPress?.();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="h-8 w-8 items-center justify-center"
    >
      {children}
    </TouchableOpacity>
  );
}

type MessageBranchContextType = {
  currentBranch: number;
  totalBranches: number;
  goToPrevious: () => void;
  goToNext: () => void;
  branches: React.ReactElement[];
  setBranches: (branches: React.ReactElement[]) => void;
};

const MessageBranchContext = createContext<MessageBranchContextType | null>(
  null,
);

function useMessageBranch() {
  const context = useContext(MessageBranchContext);
  if (!context) {
    throw new Error(
      'MessageBranch components must be used within <MessageBranch>',
    );
  }
  return context;
}

export function MessageBranch({
  defaultBranch = 0,
  onBranchChange,
  children,
  className,
}: {
  defaultBranch?: number;
  onBranchChange?: (index: number) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [currentBranch, setCurrentBranch] = useState(defaultBranch);
  const [branches, setBranches] = useState<React.ReactElement[]>([]);

  const handleBranchChange = (newBranch: number) => {
    setCurrentBranch(newBranch);
    onBranchChange?.(newBranch);
  };

  const goToPrevious = () => {
    const newBranch
      = currentBranch > 0 ? currentBranch - 1 : branches.length - 1;
    handleBranchChange(newBranch);
  };

  const goToNext = () => {
    const newBranch
      = currentBranch < branches.length - 1 ? currentBranch + 1 : 0;
    handleBranchChange(newBranch);
  };

  const contextValue: MessageBranchContextType = {
    branches,
    currentBranch,
    goToNext,
    goToPrevious,
    setBranches,
    totalBranches: branches.length,
  };

  return (
    <MessageBranchContext.Provider value={contextValue}>
      <View className={`w-full gap-2 ${className || ''}`}>{children}</View>
    </MessageBranchContext.Provider>
  );
}

export function MessageBranchContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { branches, currentBranch, setBranches } = useMessageBranch();
  const childrenArray = React.useMemo(
    () => React.Children.toArray(children) as React.ReactElement[],
    [children],
  );

  React.useEffect(() => {
    if (branches.length !== childrenArray.length) {
      setBranches(childrenArray);
    }
  }, [branches.length, childrenArray, setBranches]);

  return childrenArray.map((branch, index) => (
    <View
      key={branch.key || index}
      className={index === currentBranch ? 'flex' : 'hidden'}
    >
      {branch}
    </View>
  ));
}

export function MessageBranchSelector({
  children,
}: {
  children: React.ReactNode;
}) {
  const { totalBranches } = useMessageBranch();
  if (totalBranches <= 1)
    return null;
  return <View className="flex-row items-center gap-2">{children}</View>;
}

export function MessageBranchPrevious() {
  const { goToPrevious } = useMessageBranch();

  return (
    <TouchableOpacity
      accessibilityLabel="Previous response"
      accessibilityRole="button"
      onPress={goToPrevious}
      className="h-8 w-8 items-center justify-center"
    >
      <ChevronLeft size={18} className="text-muted-foreground" />
    </TouchableOpacity>
  );
}

export function MessageBranchNext() {
  const { goToNext } = useMessageBranch();

  return (
    <TouchableOpacity
      accessibilityLabel="Next response"
      accessibilityRole="button"
      onPress={goToNext}
      className="h-8 w-8 items-center justify-center"
    >
      <ChevronRight size={18} className="text-muted-foreground" />
    </TouchableOpacity>
  );
}

export function MessageBranchPage() {
  const { currentBranch, totalBranches } = useMessageBranch();
  return (
    <Text className="text-sm text-muted-foreground">
      {currentBranch + 1}
      {' '}
      of
      {totalBranches}
    </Text>
  );
}
