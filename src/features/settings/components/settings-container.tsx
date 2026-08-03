import type { PropsWithChildren } from 'react';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export function SettingsContainer({
  children,
  title,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <VStack className="gap-2">
      {title && (
        <Text selectable className="px-1 text-sm font-semibold text-muted-foreground uppercase">
          {title}
        </Text>
      )}
      <Card className="overflow-hidden rounded-xl border border-border bg-card p-0">
        {children}
      </Card>
    </VStack>
  );
}
