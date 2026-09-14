import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

import { configureOnlineManager } from './online-manager';

import { queryClient } from './query-client';

export function APIProvider({ children }: { children: React.ReactNode }) {
  useReactQueryDevTools(queryClient);
  React.useEffect(() => {
    configureOnlineManager();
  }, []);

  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
