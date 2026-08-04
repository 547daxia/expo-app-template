import type { Post } from './api';

import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { RefreshControl } from '@/components/ui/refresh-control';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { usePosts } from './api';
import { PostCard } from './components/post-card';

export function FeedScreen() {
  const { data, isPending, isError, isRefetching, refetch } = usePosts();

  const renderItem = React.useCallback(
    ({ item }: { item: Post }) => <PostCard {...item} />,
    [],
  );

  return (
    <FlashList
      contentInsetAdjustmentBehavior="automatic"
      data={data ?? []}
      renderItem={renderItem}
      keyExtractor={item => String(item.id)}
      ItemSeparatorComponent={() => <VStack className="h-4" />}
      ListEmptyComponent={(
        <FeedState isError={isError} isPending={isPending} />
      )}
      refreshControl={(
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => void refetch()}
        />
      )}
      contentContainerStyle={{ flexGrow: 1, padding: 16 }}
    />
  );
}

function FeedState({ isError, isPending }: { isError: boolean; isPending: boolean }) {
  if (isPending) {
    return (
      <VStack className="flex-1 items-center justify-center gap-3 py-16">
        <Spinner />
        <Text selectable className="text-muted-foreground">Loading posts…</Text>
      </VStack>
    );
  }

  return (
    <VStack className="flex-1 items-center justify-center gap-2 py-16">
      <Text selectable className="text-lg font-semibold">
        {isError ? 'Unable to load posts' : 'No posts yet'}
      </Text>
      <Text selectable className="text-center text-muted-foreground">
        {isError ? 'Pull down to try again.' : 'Create the first post to get started.'}
      </Text>
    </VStack>
  );
}
