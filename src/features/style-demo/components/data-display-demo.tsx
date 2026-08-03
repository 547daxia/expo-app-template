import React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Calendar } from '@/components/ui/calendar';
import { FlatList } from '@/components/ui/flat-list';
import { ChevronDownIcon } from '@/components/ui/icon';
import { SectionList } from '@/components/ui/section-list';
import {
  Table,
  TableBody,
  TableCaption,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsContentWrapper,
  TabsIndicator,
  TabsList,
  TabsTrigger,
  TabsTriggerText,
} from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { VirtualizedList } from '@/components/ui/virtualized-list';
import { VStack } from '@/components/ui/vstack';
import { DemoLabel, DemoRow, DemoSection } from './catalog-layout';

const listItems = ['Button', 'Input', 'Modal', 'Toast', 'Calendar'];
const sectionItems = [
  { title: 'Layout', data: ['Box', 'HStack'] },
  { title: 'Feedback', data: ['Alert', 'Progress'] },
];

export function DataDisplayDemo() {
  return (
    <DemoSection
      eyebrow="Data display"
      title="Structured content"
      description="Expandable content, calendar selection, tabs, tables and every shared list wrapper."
    >
      <VStack className="gap-5">
        <AccordionDemo />
        <CalendarDemo />
        <TabsDemo />
        <TableDemo />
        <ListWrappersDemo />
      </VStack>
    </DemoSection>
  );
}

function AccordionDemo() {
  return (
    <VStack className="gap-3">
      <DemoLabel>Accordion</DemoLabel>
      <Accordion type="multiple" defaultValue={['installation']}>
        <AccordionItem value="installation">
          <AccordionHeader>
            <AccordionTrigger>
              <AccordionTitleText>Installation</AccordionTitleText>
              <AccordionIcon as={ChevronDownIcon} />
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent><AccordionContentText>Components are stored locally under src/components/ui.</AccordionContentText></AccordionContent>
        </AccordionItem>
        <AccordionItem value="theming">
          <AccordionHeader>
            <AccordionTrigger>
              <AccordionTitleText>Theming</AccordionTitleText>
              <AccordionIcon as={ChevronDownIcon} />
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent><AccordionContentText>Semantic tokens respond to the provider theme.</AccordionContentText></AccordionContent>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
}

function CalendarDemo() {
  const [date, setDate] = React.useState(() => new Date(2026, 7, 3));

  return (
    <VStack className="gap-3">
      <DemoLabel>Calendar</DemoLabel>
      <Calendar mode="single" value={date} onValueChange={setDate} />
      <Text selectable className="text-xs text-muted-foreground">
        Selected:
        {' '}
        {date.toLocaleDateString()}
      </Text>
    </VStack>
  );
}

function TabsDemo() {
  return (
    <VStack className="gap-3">
      <DemoLabel>Tabs</DemoLabel>
      <Tabs defaultValue="preview" orientation="horizontal">
        <TabsList>
          <TabsIndicator />
          <TabsTrigger value="preview"><TabsTriggerText>Preview</TabsTriggerText></TabsTrigger>
          <TabsTrigger value="code"><TabsTriggerText>Code</TabsTriggerText></TabsTrigger>
          <TabsTrigger value="tokens"><TabsTriggerText>Tokens</TabsTriggerText></TabsTrigger>
        </TabsList>
        <TabsContentWrapper>
          <TabsContent value="preview"><Text selectable>Interactive component preview</Text></TabsContent>
          <TabsContent value="code"><Text selectable>Import from @/components/ui/…</Text></TabsContent>
          <TabsContent value="tokens"><Text selectable>Semantic colors and spacing</Text></TabsContent>
        </TabsContentWrapper>
      </Tabs>
    </VStack>
  );
}

function TableDemo() {
  return (
    <VStack className="gap-3">
      <DemoLabel>Table</DemoLabel>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Component</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableData>Button</TableData>
            <TableData>Ready</TableData>
          </TableRow>
          <TableRow>
            <TableData>DatePicker</TableData>
            <TableData>Review</TableData>
          </TableRow>
        </TableBody>
        <TableCaption>Shared UI inventory</TableCaption>
      </Table>
    </VStack>
  );
}

function ListWrappersDemo() {
  return (
    <VStack className="gap-3">
      <DemoLabel>FlatList, SectionList and VirtualizedList</DemoLabel>
      <DemoRow>
        <ListFrame title="FlatList">
          <FlatList
            data={listItems}
            nestedScrollEnabled
            keyExtractor={item => item}
            renderItem={({ item }) => <ListItem label={item} />}
          />
        </ListFrame>
        <ListFrame title="SectionList">
          <SectionList
            sections={sectionItems}
            nestedScrollEnabled
            keyExtractor={item => item}
            renderSectionHeader={({ section }) => <Text selectable className="bg-muted px-2 py-1 text-xs font-semibold">{section.title}</Text>}
            renderItem={({ item }) => <ListItem label={item} />}
          />
        </ListFrame>
        <ListFrame title="VirtualizedList">
          <VirtualizedList
            data={listItems}
            nestedScrollEnabled
            getItem={(items, index) => items[index]}
            getItemCount={items => items.length}
            keyExtractor={item => item}
            renderItem={({ item }) => <ListItem label={item} />}
          />
        </ListFrame>
      </DemoRow>
    </VStack>
  );
}

function ListFrame({ children, title }: React.PropsWithChildren<{ title: string }>) {
  return (
    <View className="h-40 min-w-40 flex-1 overflow-hidden rounded-lg border border-border">
      <Text selectable className="bg-muted px-2 py-1.5 text-xs font-semibold">{title}</Text>
      {children}
    </View>
  );
}

function ListItem({ label }: { label: string }) {
  return <Text selectable className="border-b border-border px-2 py-1.5 text-xs">{label}</Text>;
}
