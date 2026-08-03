import type { LoginFormProps } from './components/login-form';

import Env from 'env';
import React from 'react';
import { showMessage } from 'react-native-flash-message';

import { ScrollView } from '@/components/ui/scroll-view';
import { StatusBar } from '@/components/ui/status-bar';
import { View } from '@/components/ui/view';
import { navigate } from '@/lib/navigation';
import { LoginForm } from './components/login-form';
import { useAuthStore } from './use-auth-store';

export function LoginScreen() {
  const signIn = useAuthStore.use.signIn();

  const handleSubmit = React.useCallback<NonNullable<LoginFormProps['onSubmit']>>(
    () => {
      if (Env.EXPO_PUBLIC_APP_ENV === 'production') {
        showMessage({
          message: 'Demo authentication is disabled in production.',
          description: 'Configure an authentication adapter before signing in.',
          type: 'danger',
        });
        return;
      }

      signIn({ access: 'access-token', refresh: 'refresh-token' });
      navigate.replace('/');
    },
    [signIn],
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
    >
      <StatusBar barStyle="default" />
      <View className="mx-auto w-full max-w-md">
        <LoginForm onSubmit={handleSubmit} />
      </View>
    </ScrollView>
  );
}
