import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { ToastProvider } from '@gluestack-ui/core/toast/creator';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useUniwind } from 'uniwind';

// Theme preference is owned by useSelectedTheme. This provider only reflects
// the resolved theme, so mounting it cannot disable system appearance updates.
export function AppUIProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useUniwind();

  React.useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    root.style.colorScheme = theme;
  }, [theme]);

  return (
    <View style={styles.container}>
      <OverlayProvider>
        <ToastProvider>{children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, height: '100%', width: '100%' },
});
