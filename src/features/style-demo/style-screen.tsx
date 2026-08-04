import React from 'react';

import { RefreshControl } from '@/components/ui/refresh-control';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScrollView } from '@/components/ui/scroll-view';
import { StatusBar } from '@/components/ui/status-bar';
import { View } from '@/components/ui/view';
import { CatalogIntro, ComponentCoverageList } from './components/catalog-layout';
import { DataDisplayDemo } from './components/data-display-demo';
import { FeedbackDemo } from './components/feedback-demo';
import { FormsDemo } from './components/forms-demo';
import { MediaDemo } from './components/media-demo';
import { OverlaysDemo } from './components/overlays-demo';

export function StyleScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    requestAnimationFrame(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      refreshControl={(
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      )}
      contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 32 }}
    >
      <StatusBar barStyle="default" />
      <SafeAreaView edges={['bottom']}>
        <View className="gap-8">
          <CatalogIntro />
          <FormsDemo />
          <FeedbackDemo />
          <OverlaysDemo />
          <DataDisplayDemo />
          <MediaDemo />
          <ComponentCoverageList />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
