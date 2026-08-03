import type { LoginFormProps } from './components/login-form';

import Env from 'env';
import * as React from 'react';
import { FocusAwareStatusBar, showErrorMessage } from '@/components/ui';
import { navigate } from '@/lib/navigation';
import { LoginForm } from './components/login-form';
import { useAuthStore } from './use-auth-store';

export function LoginScreen() {
  const signIn = useAuthStore.use.signIn();

  const onSubmit: LoginFormProps['onSubmit'] = () => {
    if (Env.EXPO_PUBLIC_APP_ENV === 'production') {
      showErrorMessage(
        'Demo authentication is disabled in production. Configure your authentication adapter first.',
      );
      return;
    }

    signIn({ access: 'access-token', refresh: 'refresh-token' });
    navigate.replace('/');
  };

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} />
    </>
  );
}
