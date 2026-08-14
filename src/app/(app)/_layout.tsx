import { Redirect, Stack } from 'expo-router';
import { useAuthStore as useAuth } from '@/lib/auth/session-store';
import { useIsFirstTime } from '@/lib/hooks/use-is-first-time';

// eslint-disable-next-line react-refresh/only-export-components
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function AppLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  if (status === 'idle') {
    return null;
  }
  if (status === 'signOut') {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
