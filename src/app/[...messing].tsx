import { Link, Stack } from 'expo-router';

import { Heading } from '@/components/ui/heading';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export default function NotFoundScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
    >
      <Stack.Screen options={{ title: 'Oops!' }} />
      <VStack className="items-center gap-4">
        <Heading selectable size="2xl">Page not found</Heading>
        <Text selectable className="text-center text-muted-foreground">
          The address does not match a route in this application.
        </Text>
        <Link href="/" className="text-primary underline">
          Return to the app
        </Link>
      </VStack>
    </ScrollView>
  );
}
