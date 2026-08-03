import React from 'react';

import { Alert, AlertIcon, AlertText } from '@/components/ui/alert';
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarGroup,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge, BadgeIcon, BadgeText } from '@/components/ui/badge';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { CheckCircleIcon, InfoIcon, StarIcon } from '@/components/ui/icon';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import { Tooltip, TooltipContent, TooltipText } from '@/components/ui/tooltip';
import { VStack } from '@/components/ui/vstack';
import { DemoLabel, DemoRow, DemoSection } from './catalog-layout';

const avatarSource = {
  uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160',
};

export function FeedbackDemo() {
  return (
    <DemoSection
      eyebrow="Feedback"
      title="Status and progress"
      description="Alerts, identity, badges, loading states, toast notifications and contextual help."
    >
      <VStack className="gap-5">
        <StatusDemo />
        <LoadingDemo />
        <ToastAndTooltipDemo />
      </VStack>
    </DemoSection>
  );
}

function StatusDemo() {
  return (
    <VStack className="gap-3">
      <DemoLabel>Alert, avatar and badge</DemoLabel>
      <Alert>
        <AlertIcon as={InfoIcon} />
        <AlertText>Shared components inherit the active semantic theme.</AlertText>
      </Alert>
      <Alert variant="destructive">
        <AlertIcon as={InfoIcon} />
        <AlertText>Destructive state for errors requiring attention.</AlertText>
      </Alert>
      <DemoRow>
        <AvatarGroup>
          <Avatar><AvatarFallbackText>QT</AvatarFallbackText></Avatar>
          <Avatar>
            <AvatarFallbackText>UI</AvatarFallbackText>
            <AvatarImage alt="UI team member" source={avatarSource} />
            <AvatarBadge />
          </Avatar>
        </AvatarGroup>
        <Badge>
          <BadgeIcon as={StarIcon} />
          <BadgeText>Featured</BadgeText>
        </Badge>
        <Badge variant="secondary"><BadgeText>Preview</BadgeText></Badge>
        <Badge variant="outline"><BadgeText>Outline</BadgeText></Badge>
      </DemoRow>
    </VStack>
  );
}

function LoadingDemo() {
  return (
    <VStack className="gap-3">
      <DemoLabel>Progress, spinner and skeleton</DemoLabel>
      <DemoRow>
        <Spinner />
        <Text selectable className="text-sm">Synchronizing components…</Text>
      </DemoRow>
      <Progress value={72} className="w-full">
        <ProgressFilledTrack />
      </Progress>
      <DemoRow>
        <Skeleton className="size-12 rounded-full" />
        <SkeletonText className="h-3 w-full rounded-sm" _lines={3} />
      </DemoRow>
    </VStack>
  );
}

function ToastAndTooltipDemo() {
  const toast = useToast();

  const showToast = () => {
    toast.show({
      placement: 'top',
      render: ({ id }) => (
        <Toast nativeID={`style-toast-${id}`} action="success">
          <ToastTitle>Component rendered</ToastTitle>
          <ToastDescription>The shared ToastProvider is working.</ToastDescription>
        </Toast>
      ),
    });
  };

  return (
    <VStack className="gap-3">
      <DemoLabel>Toast and tooltip</DemoLabel>
      <DemoRow>
        <Button onPress={showToast}>
          <ButtonIcon as={CheckCircleIcon} />
          <ButtonText>Show toast</ButtonText>
        </Button>
        <Tooltip
          placement="top"
          trigger={triggerProps => (
            <Button {...triggerProps} variant="outline">
              <ButtonText>Hold for help</ButtonText>
            </Button>
          )}
        >
          <TooltipContent><TooltipText>Tooltip content</TooltipText></TooltipContent>
        </Tooltip>
      </DemoRow>
    </VStack>
  );
}
