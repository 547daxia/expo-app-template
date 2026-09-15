import type { PropsWithChildren, ReactNode } from 'react';

import { selectableTextProps, textTestIdProps } from '@/components/platform-props';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Grid, GridItem } from '@/components/ui/grid';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Link, LinkText } from '@/components/ui/link';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { VStack } from '@/components/ui/vstack';
import { COMPONENT_GROUPS, PROJECT_COMPONENT_GROUPS } from './component-groups';

type DemoSectionProps = PropsWithChildren<{
  description: string;
  eyebrow: string;
  title: string;
}>;

export function DemoSection({
  children,
  description,
  eyebrow,
  title,
}: DemoSectionProps) {
  return (
    <VStack className="gap-4">
      <VStack className="gap-1 px-1">
        <Text {...selectableTextProps} className="text-xs font-semibold text-primary uppercase">
          {eyebrow}
        </Text>
        <Heading {...selectableTextProps} size="xl">
          {title}
        </Heading>
        <Text {...selectableTextProps} className="text-sm/5 text-muted-foreground">
          {description}
        </Text>
      </VStack>
      <Card className="gap-5 rounded-2xl border border-border bg-card p-4">
        {children}
      </Card>
    </VStack>
  );
}

export function DemoRow({ children }: PropsWithChildren) {
  return <HStack className="flex-wrap items-center gap-3">{children}</HStack>;
}

export function DemoLabel({ children }: { children: ReactNode }) {
  return (
    <Text {...selectableTextProps} className="text-xs font-medium text-muted-foreground uppercase">
      {children}
    </Text>
  );
}

export function CatalogIntro() {
  return (
    <Box className="overflow-hidden rounded-3xl bg-primary p-5">
      <VStack className="gap-4">
        <VStack className="gap-1">
          <Text {...selectableTextProps} className="text-xs font-semibold text-primary-foreground/80 uppercase">
            Gluestack UI catalog
          </Text>
          <Heading
            {...selectableTextProps}
            {...textTestIdProps('style-catalog-count')}
            className="text-primary-foreground"
            size="2xl"
          >
            {`${COMPONENT_GROUPS.length + PROJECT_COMPONENT_GROUPS.length} component groups`}
          </Heading>
          <Text {...selectableTextProps} className="leading-5 text-primary-foreground/80">
            Interactive examples of generated primitives and project components.
          </Text>
        </VStack>

        <Grid
          _extra={{ className: 'grid-cols-2' }}
          className="gap-3"
          gap={12}
        >
          <GridItem _extra={{ className: 'col-span-1' }}>
            <Center className="rounded-2xl bg-white/15 p-3">
              <Text {...selectableTextProps} className="text-2xl font-bold text-primary-foreground">
                {COMPONENT_GROUPS.length + PROJECT_COMPONENT_GROUPS.length}
              </Text>
              <Text {...selectableTextProps} className="text-xs text-primary-foreground/75">
                directories
              </Text>
            </Center>
          </GridItem>
          <GridItem _extra={{ className: 'col-span-1' }}>
            <Center className="rounded-2xl bg-white/15 p-3">
              <Text {...selectableTextProps} className="text-2xl font-bold text-primary-foreground">
                7
              </Text>
              <Text {...selectableTextProps} className="text-xs text-primary-foreground/75">
                demo sections
              </Text>
            </Center>
          </GridItem>
        </Grid>

        <Divider className="bg-white/20" />
        <HStack className="items-center justify-between gap-3">
          <Link href="https://gluestack.io/ui/docs/home/overview/introduction">
            <LinkText className="text-primary-foreground" size="sm">
              Gluestack documentation
            </LinkText>
          </Link>
          <Pressable
            accessibilityLabel="Component catalog is ready"
            className="rounded-full bg-white/15 px-3 py-1.5"
          >
            <Text {...selectableTextProps} className="text-xs font-semibold text-primary-foreground">
              Provider active
            </Text>
          </Pressable>
        </HStack>
      </VStack>
    </Box>
  );
}

export function ComponentCoverageList() {
  return (
    <DemoSection
      eyebrow="Coverage"
      title="Component inventory"
      description="Generated primitives and project components demonstrated on this page."
    >
      <View className="flex-row flex-wrap gap-2">
        {[...COMPONENT_GROUPS, ...PROJECT_COMPONENT_GROUPS].map(name => (
          <View key={name} className="rounded-full bg-muted px-2.5 py-1">
            <Text {...selectableTextProps} className="text-xs text-foreground">
              {name}
            </Text>
          </View>
        ))}
      </View>
    </DemoSection>
  );
}
