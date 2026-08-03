import type { Post } from '../api';

import { Link } from 'expo-router';
import React from 'react';

import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

const POST_IMAGES = [
  'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515386474292-47555758ef2e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80',
];

export function PostCard({ title, body, id }: Post) {
  const imageUrl = POST_IMAGES[Math.abs(id) % POST_IMAGES.length];

  return (
    <Link href={`/feed/${id}`} asChild>
      <Pressable accessibilityLabel={`Open post: ${title}`}>
        <Card className="overflow-hidden rounded-2xl border border-border bg-card p-0">
          <Image
            alt="Post cover"
            accessibilityLabel="Post cover"
            className="h-48 w-full"
            resizeMode="cover"
            source={{ uri: imageUrl }}
          />
          <VStack className="gap-2 p-4">
            <Text selectable className="text-xl font-semibold">
              {title}
            </Text>
            <Text
              selectable
              className="leading-5 text-muted-foreground"
              numberOfLines={3}
            >
              {body}
            </Text>
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}
