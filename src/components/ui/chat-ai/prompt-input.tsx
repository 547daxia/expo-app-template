'use client';

import type { ComponentProps, PropsWithChildren, ReactNode } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, {
  createContext,

  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';

// ====================== CONTEXT ======================

type PromptContextType = {
  text: string;
  setText: (t: string) => void;
  handleSubmit: () => void;
  isDisabled: boolean;
};

const PromptContext = createContext<PromptContextType | null>(null);

function usePrompt() {
  const context = useContext(PromptContext);
  if (!context)
    throw new Error('Must be inside PromptInput');
  return context;
}

// ====================== ATTACHMENTS ======================

function generateId(): string {
  return (
    Math.random().toString(36).substring(2)
    + Math.random().toString(36).substring(2)
  );
}

export type FileUIPart = {
  type: 'file';
  filename?: string;
  mediaType?: string;
  url: string;
};

export type PromptAttachment = FileUIPart & { id: string };

type AttachmentsContextType = {
  files: PromptAttachment[];
  add: (files: PromptAttachment | PromptAttachment[]) => void;
  remove: (id: string) => void;
  clear: () => void;
  openImagePicker: () => Promise<void>;
};

const AttachmentsContext = createContext<AttachmentsContextType | null>(null);

export function usePromptInputAttachments() {
  const context = useContext(AttachmentsContext);
  if (!context) {
    throw new Error('usePromptInputAttachments must be used within provider');
  }
  return context;
}

export function PromptInputProvider({ children }: { children: ReactNode }) {
  const [attachmentFiles, setAttachmentFiles] = useState<PromptAttachment[]>([]);

  const add = useCallback((newFiles: PromptAttachment | PromptAttachment[]) => {
    const filesToAdd = Array.isArray(newFiles) ? newFiles : [newFiles];
    setAttachmentFiles(prev => [...prev, ...filesToAdd]);
  }, []);

  const remove = useCallback((id: string) => {
    setAttachmentFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const clear = useCallback(() => {
    setAttachmentFiles([]);
  }, []);

  // ====================== FIXED IMAGE PICKER ======================
  const openImagePicker = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.1,
      base64: Platform.OS !== 'web', // base64 only on native
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newFiles = result.assets.map((asset) => {
        const url = Platform.OS !== 'web' && asset.base64
          ? `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`
          : asset.uri;

        return {
          id: generateId(),
          filename: asset.fileName || `image-${Date.now()}.jpg`,
          mediaType: asset.mimeType || 'image/jpeg',
          type: 'file' as const,
          url,
        };
      });

      add(newFiles);
    }
  }, [add]);

  const attachmentsValue = useMemo(
    () => ({
      files: attachmentFiles,
      add,
      remove,
      clear,
      openImagePicker,
    }),
    [attachmentFiles, add, remove, clear, openImagePicker],
  );

  return (
    <AttachmentsContext.Provider value={attachmentsValue}>
      {children}
    </AttachmentsContext.Provider>
  );
}

export type PromptInputValue = {
  text: string;
  files: PromptAttachment[];
};

export type PromptInputProps = PropsWithChildren<{
  onSubmit?: (value: PromptInputValue) => void;
}>;

export function PromptInput({
  children,
  onSubmit,
}: PromptInputProps) {
  const [text, setText] = useState('');
  const attachments = usePromptInputAttachments();

  const handleSubmit = () => {
    onSubmit?.({ text, files: attachments.files });
    setText('');
    attachments.clear();
  };

  const isDisabled = !text.trim() && attachments.files.length === 0;

  const { height } = useReanimatedKeyboardAnimation();
  const inputAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: height.value }],
    }),
    [height],
  );

  return (
    <PromptContext.Provider value={{ text, setText, handleSubmit, isDisabled }}>
      <Animated.View style={inputAnimatedStyle}>
        <View className="absolute bottom-4 w-full rounded-3xl border-border bg-muted px-3 py-2">
          {children}
        </View>
      </Animated.View>
    </PromptContext.Provider>
  );
}

export function PromptInputBody({ children }: { children: ReactNode }) {
  return <View className="flex-row items-center gap-2 pt-2">{children}</View>;
}

export function PromptInputTextarea({
  onChangeText,
  ...props
}: Omit<ComponentProps<typeof TextInput>, 'value'>) {
  const { text, setText } = usePrompt();
  return (
    <TextInput
      value={text}
      onChangeText={(value) => {
        setText(value);
        onChangeText?.(value);
      }}
      placeholder="Let’s start building it"
      multiline
      className="flex-1 items-center justify-center rounded-3xl px-4 text-xl text-foreground placeholder:text-muted-foreground focus:border-transparent focus:ring-0 focus:outline-none"
      {...props}
    />
  );
}

export function PromptInputFooter({ children }: { children: ReactNode }) {
  return <View className="mt-6 flex-row items-center justify-between">{children}</View>;
}

export function PromptInputTools({ children }: { children: ReactNode }) {
  return <View className="flex-row items-center gap-2">{children}</View>;
}

export function PromptInputButton({
  children,
  ...props
}: ComponentProps<typeof TouchableOpacity>) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      className="rounded-full bg-muted px-3 py-1"
      {...props}
    >
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </TouchableOpacity>
  );
}

export function PromptInputSubmit() {
  const { handleSubmit, isDisabled } = usePrompt();
  return (
    <TouchableOpacity
      onPress={handleSubmit}
      disabled={isDisabled}
      className={`mx-3 h-10 w-10 items-center justify-center rounded-full bg-primary ${
        isDisabled ? 'opacity-50' : ''
      }`}
    >
      <Text className="text-primary-foreground">↑</Text>
    </TouchableOpacity>
  );
}

export function PromptInputActionMenu({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export function PromptInputActionMenuTrigger({
  children,
  ...props
}: ComponentProps<typeof TouchableOpacity>) {
  return (
    <TouchableOpacity {...props}>
      <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        {children ?? <Text className="text-xl text-primary">+</Text>}
      </View>
    </TouchableOpacity>
  );
}

export function PromptInputActionMenuContent({
  trigger,
}: {
  trigger: NonNullable<ComponentProps<typeof Menu>['trigger']>;
}) {
  const attachments = usePromptInputAttachments();

  const openDocumentPicker = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({ multiple: true });

    if (result.assets) {
      const newFiles = result.assets.map(asset => ({
        id: generateId(),
        filename: asset.name,
        mediaType: asset.mimeType,
        type: 'file' as const,
        url: asset.uri,
      }));

      attachments.add(newFiles);
    }
  }, [attachments]);

  return (
    <Menu placement="top" offset={5} trigger={trigger}>
      <MenuItem onPress={attachments.openImagePicker}>
        <MenuItemLabel>Select Image</MenuItemLabel>
      </MenuItem>

      <MenuItem onPress={openDocumentPicker}>
        <MenuItemLabel>Select Document</MenuItemLabel>
      </MenuItem>
    </Menu>
  );
}
