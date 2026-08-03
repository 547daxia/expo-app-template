import { Stack, useLocalSearchParams } from 'expo-router';

import { ScrollView } from '@/components/ui/scroll-view';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { usePost } from './api';

export function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending, isError } = usePost({ variables: { id } });

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
    return <Spinner className="flex-1" />;
  }

  if (isError || !data) {
    return (
      <VStack className="flex-1 items-center justify-center gap-2">
        <Text selectable className="text-lg font-semibold">Unable to load this post</Text>
        <Text selectable className="text-muted-foreground">Go back and try again.</Text>
      </VStack>
    );
  }

  return (
    <VStack className="gap-4">
      <Text selectable className="text-3xl font-bold">{data.title}</Text>
      <Text selectable className="text-base/7 text-muted-foreground">{data.body}</Text>
    </VStack>
  );
}
