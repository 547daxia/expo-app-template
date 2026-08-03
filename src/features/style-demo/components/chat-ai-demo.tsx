import type { UIMessage } from 'ai';

import React from 'react';

import { Button, ButtonText } from '@/components/ui/button';
import {
  Attachment,
  AttachmentPreview,
  Attachments,
  Conversation,
  ConversationContent,
  ConversationDownload,
  ConversationScrollButton,
  FileTree,
  FileTreeFile,
  FileTreeFolder,
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorSeparator,
  ModelSelectorTrigger,
  PromptInput,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/ui/chat-ai';
import { PaperclipIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { VStack } from '@/components/ui/vstack';
import { DemoLabel, DemoSection } from './catalog-layout';

const messages: UIMessage[] = [
  {
    id: 'user-1',
    role: 'user',
    parts: [{ type: 'text', text: 'Show me the shared UI structure.' }],
  },
  {
    id: 'assistant-1',
    role: 'assistant',
    parts: [{ type: 'text', text: '**src/components/ui** contains reusable, themed primitives.' }],
  },
];

const sampleAttachment = {
  id: 'style-demo-file',
  type: 'file' as const,
  filename: 'component-map.pdf',
  mediaType: 'application/pdf',
  url: 'https://example.com/component-map.pdf',
};

export function ChatAIDemo() {
  return (
    <DemoSection
      eyebrow="AI patterns"
      title="Chat AI components"
      description="Conversation rendering, prompt composition, attachments, model selection and an interactive file tree."
    >
      <VStack className="gap-5">
        <ConversationDemo />
        <PromptDemo />
        <ModelAndFileDemo />
      </VStack>
    </DemoSection>
  );
}

function ConversationDemo() {
  return (
    <VStack className="gap-3">
      <DemoLabel>Conversation and attachments</DemoLabel>
      <View className="h-80 overflow-hidden rounded-xl border border-border">
        <Conversation>
          <ConversationContent messages={messages} />
          <ConversationDownload messages={messages} onDownload={() => undefined} />
          <ConversationScrollButton onPress={() => undefined} />
        </Conversation>
      </View>
      <Attachments variant="inline" className="rounded-xl">
        <Attachment data={sampleAttachment} onRemove={() => undefined}>
          <AttachmentPreview />
          <Text selectable className="text-xs">component-map.pdf</Text>
        </Attachment>
      </Attachments>
    </VStack>
  );
}

function PromptDemo() {
  const [lastPrompt, setLastPrompt] = React.useState('Nothing submitted yet.');

  return (
    <VStack className="gap-3">
      <DemoLabel>Prompt input</DemoLabel>
      <PromptInputProvider>
        <View className="relative h-52 overflow-hidden rounded-xl border border-border bg-background">
          <PromptInput onSubmit={({ text }: { text: string }) => setLastPrompt(text || 'Attachment submitted')}>
            <PromptInputBody><PromptInputTextarea /></PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuContent
                    trigger={triggerProps => (
                      <PromptInputActionMenuTrigger {...triggerProps}>
                        <PaperclipIcon className="text-primary" />
                      </PromptInputActionMenuTrigger>
                    )}
                  />
                </PromptInputActionMenu>
              </PromptInputTools>
              <PromptInputSubmit />
            </PromptInputFooter>
          </PromptInput>
        </View>
      </PromptInputProvider>
      <Text selectable className="text-xs text-muted-foreground">
        Last prompt:
        {lastPrompt}
      </Text>
    </VStack>
  );
}

function ModelAndFileDemo() {
  const [modelOpen, setModelOpen] = React.useState(false);
  const [selectedPath, setSelectedPath] = React.useState('/src/app.tsx');

  return (
    <VStack className="gap-3">
      <DemoLabel>Model selector and file tree</DemoLabel>
      <ModelSelector open={modelOpen} onOpenChange={setModelOpen}>
        <ModelSelectorTrigger asChild>
          <Button variant="outline"><ButtonText>Select model</ButtonText></Button>
        </ModelSelectorTrigger>
        <ModelSelectorContent>
          <ModelSelectorInput placeholder="Search models" />
          <ModelSelectorList>
            <ModelSelectorGroup heading="OpenAI">
              <ModelSelectorItem className="h-auto w-full rounded-lg" isSelected onPress={() => setModelOpen(false)}>
                <ModelSelectorLogo provider="OpenAI" />
                <ModelSelectorName>GPT model</ModelSelectorName>
              </ModelSelectorItem>
              <ModelSelectorSeparator />
              <ModelSelectorItem className="h-auto w-full rounded-lg" onPress={() => setModelOpen(false)}>
                <ModelSelectorLogo provider="OpenAI" />
                <ModelSelectorName>Reasoning model</ModelSelectorName>
              </ModelSelectorItem>
            </ModelSelectorGroup>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
      <FileTree
        defaultExpanded={new Set(['/src'])}
        selectedPath={selectedPath}
        onSelect={setSelectedPath}
      >
        <FileTreeFolder path="/src" name="src">
          <FileTreeFile path="/src/app.tsx" name="app.tsx" />
          <FileTreeFile path="/src/global.css" name="global.css" />
        </FileTreeFolder>
        <FileTreeFile path="/package.json" name="package.json" />
      </FileTree>
    </VStack>
  );
}
