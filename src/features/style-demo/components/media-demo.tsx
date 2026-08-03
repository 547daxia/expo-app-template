import React from 'react';

import { GlobeIcon, Icon, MoonIcon, SunIcon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { ImageBackground } from '@/components/ui/image-background';
import {
  ImageViewer,
  ImageViewerCloseButton,
  ImageViewerContent,
  ImageViewerCounter,
  ImageViewerNavigation,
  ImageViewerTrigger,
} from '@/components/ui/image-viewer';
import { GlassContainer, GlassView, isLiquidGlassAvailable } from '@/components/ui/liquid-glass';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { VStack } from '@/components/ui/vstack';
import { DemoLabel, DemoRow, DemoSection } from './catalog-layout';

const images = [
  {
    url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200',
    alt: 'Mountain landscape',
  },
  {
    url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200',
    alt: 'Forest path',
  },
];

export function MediaDemo() {
  return (
    <DemoSection
      eyebrow="Media"
      title="Images and visual effects"
      description="Image primitives, backgrounds, full-screen viewing, shared icons and liquid-glass fallback behavior."
    >
      <VStack className="gap-5">
        <IconDemo />
        <ImageDemo />
        <GlassDemo />
      </VStack>
    </DemoSection>
  );
}

function IconDemo() {
  return (
    <VStack className="gap-3">
      <DemoLabel>Icon</DemoLabel>
      <DemoRow>
        <IconTile label="Sun"><Icon as={SunIcon} size="xl" className="text-primary" /></IconTile>
        <IconTile label="Moon"><Icon as={MoonIcon} size="xl" className="text-primary" /></IconTile>
        <IconTile label="Globe"><Icon as={GlobeIcon} size="xl" className="text-primary" /></IconTile>
      </DemoRow>
    </VStack>
  );
}

function IconTile({ children, label }: React.PropsWithChildren<{ label: string }>) {
  return (
    <View className="min-w-20 items-center gap-2 rounded-xl border border-border p-3">
      {children}
      <Text selectable className="text-xs">{label}</Text>
    </View>
  );
}

function ImageDemo() {
  return (
    <VStack className="gap-3">
      <DemoLabel>Image, image-background and image-viewer</DemoLabel>
      <DemoRow>
        <Image
          alt="Mountain thumbnail"
          accessibilityLabel="Mountain thumbnail"
          className="rounded-xl"
          size="xl"
          source={{ uri: images[0].url }}
        />
        <ImageBackground
          accessibilityLabel="Forest image background"
          className="h-32 min-w-44 flex-1 overflow-hidden rounded-xl"
          imageStyle={{ borderRadius: 12 }}
          source={{ uri: images[1].url }}
        >
          <View className="flex-1 justify-end bg-black/25 p-3">
            <Text selectable className="font-semibold text-white">Image background</Text>
          </View>
        </ImageBackground>
      </DemoRow>
      <ImageViewer images={images}>
        <ImageViewerTrigger>
          <View className="flex-row items-center justify-between rounded-xl bg-muted p-3">
            <Text selectable className="font-medium">Open full-screen image viewer</Text>
            <Icon as={GlobeIcon} className="text-primary" />
          </View>
        </ImageViewerTrigger>
        <ImageViewerContent>
          <ImageViewerCloseButton />
          <ImageViewerNavigation />
          <ImageViewerCounter />
        </ImageViewerContent>
      </ImageViewer>
    </VStack>
  );
}

function GlassDemo() {
  const available = process.env.EXPO_OS === 'ios' && isLiquidGlassAvailable();

  return (
    <VStack className="gap-3">
      <DemoLabel>Liquid glass</DemoLabel>
      <View className="relative h-32 overflow-hidden rounded-2xl bg-primary/25 p-4">
        <GlassContainer className="flex-1 rounded-2xl">
          <GlassView className="flex-1 items-center justify-center rounded-2xl p-4">
            <Text selectable className="text-center font-semibold">Glass effect preview</Text>
            <Text selectable className="text-center text-xs text-muted-foreground">
              {available ? 'Native liquid glass is available.' : 'Cross-platform translucent fallback.'}
            </Text>
          </GlassView>
        </GlassContainer>
      </View>
    </VStack>
  );
}
