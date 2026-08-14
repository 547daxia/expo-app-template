import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';

import { Spinner } from '@/components/ui/spinner';

export function LoadingIndicator({ fill = false }: { fill?: boolean }) {
  const indicator = Platform.OS === 'web'
    ? <ActivityIndicator accessibilityLabel="loading" />
    : <Spinner />;

  if (!fill) {
    return indicator;
  }

  return <View style={styles.fill}>{indicator}</View>;
}

const styles = StyleSheet.create({
  fill: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
