import { QueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/lib/auth/session-store';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
    queries: {
      retry: 2,
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

useAuthStore.subscribe((state, previous) => {
  if (state.sessionId !== previous.sessionId) {
    // Destroy queries (including in-flight work) and mutation cache. The HTTP
    // boundary also rejects late results from the previous session.
    queryClient.clear();
  }
});
