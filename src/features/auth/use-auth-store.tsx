import type { TokenType } from '@/lib/auth/utils';

import { create } from 'zustand';
import { clearTokenCache, setTokenCache } from '@/lib/api/client';
import { getToken, removeToken, setToken } from '@/lib/auth/utils';
import { createSelectors } from '@/lib/utils';

type AuthState = {
  token: TokenType | null;
  status: 'idle' | 'signOut' | 'signIn';
  signIn: (data: TokenType) => Promise<void>;
  signOut: () => Promise<void>;
  hydrate: () => Promise<void>;
};

const _useAuthStore = create<AuthState>(set => ({
  status: 'idle',
  token: null,
  signIn: async (token) => {
    await setToken(token);
    setTokenCache(token);
    set({ status: 'signIn', token });
  },
  signOut: async () => {
    await removeToken();
    clearTokenCache();
    set({ status: 'signOut', token: null });
  },
  hydrate: async () => {
    const HYDRATE_TIMEOUT = 10_000; // Increased to 10s for slow devices
    let timeoutId: NodeJS.Timeout | null = null;

    try {
      const tokenPromise = getToken();
      const timeoutPromise = new Promise<'TIMEOUT'>((resolve) => {
        timeoutId = setTimeout(resolve, HYDRATE_TIMEOUT, 'TIMEOUT');
      });

      const result = await Promise.race([tokenPromise, timeoutPromise]);

      // Clear timeout if token loaded successfully
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      if (result === 'TIMEOUT') {
        // Timeout occurred - fail safe to signOut but log for debugging
        console.warn('Token hydration timed out after', HYDRATE_TIMEOUT, 'ms');
        set({ status: 'signOut', token: null });
      }
      else {
        // Successfully retrieved token (or null if no token exists)
        const userToken = result;
        if (userToken !== null) {
          setTokenCache(userToken);
        }
        set(userToken === null
          ? { status: 'signOut', token: null }
          : { status: 'signIn', token: userToken });
      }
    }
    catch (e) {
      // Clear timeout on error
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      console.error('Token hydration failed:', e);
      set({ status: 'signOut', token: null });
    }
  },
}));

export const useAuthStore = createSelectors(_useAuthStore);

export const signOut = () => _useAuthStore.getState().signOut();
export const signIn = (token: TokenType) => _useAuthStore.getState().signIn(token);
export const hydrateAuth = () => _useAuthStore.getState().hydrate();
