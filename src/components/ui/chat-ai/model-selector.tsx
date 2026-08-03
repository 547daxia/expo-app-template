import type { ComponentProps, ReactNode } from 'react';
import { X } from 'lucide-react-native';
import React, {
  Children,
  cloneElement,
  isValidElement,
} from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '@/components/ui/modal';

// Context
const ModelSelectorContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
} | null>(null);

function useModelSelector() {
  const ctx = React.useContext(ModelSelectorContext);
  if (!ctx) {
    throw new Error(
      'ModelSelector sub-components must be used inside <ModelSelector>',
    );
  }
  return ctx;
}

// ─────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────
export type ModelSelectorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  children: ReactNode;
};

export function ModelSelector({
  open,
  onOpenChange,
  size = 'md',
  children,
}: ModelSelectorProps) {
  const childrenArray = Children.toArray(children);

  const triggerChildren: ReactNode[] = [];
  let contentElement: React.ReactElement | null = null;

  childrenArray.forEach((child) => {
    if (isValidElement(child) && child.type === ModelSelectorContent) {
      contentElement = child;
    }
    else {
      triggerChildren.push(child);
    }
  });

  return (
    <ModelSelectorContext.Provider value={{ open, onOpenChange }}>
      {triggerChildren}

      <Modal isOpen={open} onClose={() => onOpenChange(false)} size={size}>
        <ModalBackdrop />
        {contentElement}
      </Modal>
    </ModelSelectorContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
// Trigger (asChild support)
// ─────────────────────────────────────────────────────────────
export type ModelSelectorTriggerProps = {
  asChild?: boolean;
} & ComponentProps<typeof Pressable>;

export function ModelSelectorTrigger({
  asChild = false,
  className,
  children,
  onPress: userOnPress,
  ...props
}: ModelSelectorTriggerProps) {
  const { onOpenChange } = useModelSelector();

  const handlePress: NonNullable<
    ComponentProps<typeof Pressable>['onPress']
  > = (event) => {
    onOpenChange(true);
    userOnPress?.(event);
  };

  if (asChild && isValidElement<{ className?: string }>(children)) {
    return cloneElement(children, {
      ...props,
      onPress: handlePress,
      className: `${children.props.className || ''} ${className || ''}`,
    } as any);
  }

  return (
    <Pressable
      className={`h-[40px] w-[200px] justify-between bg-primary ${className || ''}`}
      onPress={handlePress}
      {...props}
    >
      {children}
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────
// Content
// ─────────────────────────────────────────────────────────────
export type ModelSelectorContentProps = Omit<
  ComponentProps<typeof ModalContent>,
  'children'
> & {
  children?: ReactNode;
  title?: ReactNode;
};

export function ModelSelectorContent({
  title = 'Model Selector',
  children,
  className,
  ...props
}: ModelSelectorContentProps) {
  return (
    <ModalContent className={className} {...props}>
      <ModalHeader>
        <Text className="sr-only">{title}</Text>
        <ModalCloseButton>
          <X size={20} className="text-muted-foreground" />
        </ModalCloseButton>
      </ModalHeader>
      <ScrollView className="max-h-[500px]">
        <ModalBody>{children}</ModalBody>
      </ScrollView>
    </ModalContent>
  );
}

// Rest of the components (unchanged)
export function ModelSelectorInput({
  className,
  ...props
}: ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      className={`h-12 border-b border-border px-4 text-base text-foreground placeholder:text-muted-foreground ${className || ''}`}
      placeholder="Search models..."
      {...props}
    />
  );
}

export function ModelSelectorList({
  className,
  ...props
}: ComponentProps<typeof View>) {
  return <View className={`flex-1 ${className || 'w-full'}`} {...props} />;
}

export function ModelSelectorEmpty({
  className,
  ...props
}: ComponentProps<typeof View>) {
  return (
    <View
      className={`flex-1 items-center justify-center py-12 ${className || ''}`}
      {...props}
    >
      <Text className="text-muted-foreground">No models found.</Text>
    </View>
  );
}

export function ModelSelectorGroup({
  heading,
  children,
  className,
  ...props
}: ComponentProps<typeof View> & { heading?: string }) {
  return (
    <View className={className} {...props}>
      {heading && (
        <Text className="px-4 py-2 text-sm font-semibold text-muted-foreground">
          {heading}
        </Text>
      )}
      {children}
    </View>
  );
}

export function ModelSelectorItem({
  isSelected = false,
  children,
  className,
  ...props
}: ComponentProps<typeof Pressable> & { isSelected?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`min-h-11 w-full flex-row items-center px-4 py-3 ${isSelected ? 'bg-accent' : 'active:bg-muted'} ${className || ''}`}
      {...props}
    >
      {children}
    </Pressable>
  );
}

export function ModelSelectorShortcut({
  className,
  ...props
}: ComponentProps<typeof View>) {
  return <View className={`ml-auto ${className || ''}`} {...props} />;
}

export function ModelSelectorSeparator({
  className,
}: {
  className?: string;
}) {
  return <View className={`mx-4 my-1 h-px bg-border ${className || ''}`} />;
}

export function ModelSelectorLogo({ provider }: { provider: string }) {
  return (
    <View className="h-5 w-5 items-center justify-center rounded-full bg-muted">
      <Text className="text-[10px] font-medium text-foreground">
        {provider.slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
}

export function ModelSelectorLogoGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <View className={`flex-row -space-x-1 ${className || ''}`}>{children}</View>;
}

export function ModelSelectorName({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Text
      className={`ml-3 flex-1 text-left text-base text-foreground ${className || ''}`}
    >
      {children}
    </Text>
  );
}
