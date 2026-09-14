import { Stack, useLocalSearchParams } from 'expo-router';

import { LoadingIndicator } from '@/components/loading-indicator';
import { selectableTextProps } from '@/components/platform-props';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuthStore } from '@/lib/auth/session-store';
import { usePost } from './api';

export function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sessionId = useAuthStore.use.sessionId();
  const { data, isPending, isError } = usePost({ variables: { id, sessionId } });

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ flexGrow: 1, padding: 20 }}
    >
      <Stack.Screen options={{ title: data?.title ?? 'Post', headerBackTitle: 'Feed' }} />
      <PostDetailState data={data} isError={isError} isPending={isPending} />
    </ScrollView>
  );
}

function PostDetailState({
  data,
  isError,
  isPending,
}: {
  data?: { title: string; body: string };
  isError: boolean;
  isPending: boolean;
}) {
  if (isPending) {
    return <LoadingIndicator fill />;
  }

  if (isError || !data) {
    return (
      <VStack className="flex-1 items-center justify-center gap-2">
        <Text {...selectableTextProps} className="text-lg font-semibold">Unable to load this post</Text>
        <Text {...selectableTextProps} className="text-muted-foreground">Go back and try again.</Text>
      </VStack>
    );
  }

  return (
    <VStack className="gap-4">
      <Text {...selectableTextProps} className="text-3xl font-bold">{data.title}</Text>
      <Text {...selectableTextProps} className="text-muted-foreground text-base/7">{data.body}</Text>
    </VStack>
  );
}
