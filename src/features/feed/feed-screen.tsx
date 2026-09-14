import type { Post } from './api';

import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { LoadingIndicator } from '@/components/loading-indicator';
import { selectableTextProps } from '@/components/platform-props';
import { Button, ButtonText } from '@/components/ui/button';
import { RefreshControl } from '@/components/ui/refresh-control';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuthStore } from '@/lib/auth/session-store';
import { usePosts } from './api';
import { PostCard } from './components/post-card';
import { isDemoFeed } from './data-source';

export function FeedScreen() {
  const sessionId = useAuthStore.use.sessionId();
  const {
    data,
    isPending,
    isError,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = usePosts({ variables: { sessionId } });
  const posts = React.useMemo(() => {
    const unique = new Map(data?.pages.flatMap(page => page.posts).map(post => [post.id, post]));
    return [...unique.values()];
  }, [data]);
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage && !isRefetching) {
      void fetchNextPage();
    }
  };

  const renderItem = React.useCallback(
    ({ item }: { item: Post }) => <PostCard {...item} />,
    [],
  );

  return (
    <FlashList
      contentInsetAdjustmentBehavior="automatic"
      data={posts}
      renderItem={renderItem}
      onEndReached={() => {
        if (!isFetchNextPageError)
          loadMore();
      }}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={isDemoFeed
        ? (
            <Text {...selectableTextProps} className="text-muted-foreground mb-4">
              Demo posts you create stay available until you sign out or restart the app.
            </Text>
          )
        : null}
      ListFooterComponent={hasNextPage
        ? (
            <Button
              className="my-4"
              isDisabled={isFetchingNextPage || isRefetching}
              onPress={loadMore}
            >
              <ButtonText>
                {isFetchingNextPage ? 'Loading more…' : isFetchNextPageError ? 'Retry loading more' : 'Load more'}
              </ButtonText>
            </Button>
          )
        : null}
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
        <LoadingIndicator />
        <Text {...selectableTextProps} className="text-muted-foreground">Loading posts…</Text>
      </VStack>
    );
  }

  return (
    <VStack className="flex-1 items-center justify-center gap-2 py-16">
      <Text {...selectableTextProps} className="text-lg font-semibold">
        {isError ? 'Unable to load posts' : 'No posts yet'}
      </Text>
      <Text {...selectableTextProps} className="text-muted-foreground text-center">
        {isError ? 'Pull down to try again.' : 'Create the first post to get started.'}
      </Text>
    </VStack>
  );
}
