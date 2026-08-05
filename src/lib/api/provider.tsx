/* eslint-disable react-refresh/only-export-components */
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
    queries: {
      retry: 2,
      staleTime: 30_000,
      // Keep inactive queries around for five minutes so back-navigation does
      // not hit the network again immediately.
      gcTime: 5 * 60_000,
      // React Native reports AppState changes frequently; avoid refetching
      // every time the app regains focus. Recovery still happens on reconnect.
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

export function APIProvider({ children }: { children: React.ReactNode }) {
  useReactQueryDevTools(queryClient);
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
