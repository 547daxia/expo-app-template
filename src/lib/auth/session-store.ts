import type { TokenType } from './utils';

import { create } from 'zustand';

import { createSelectors } from '@/lib/utils';
import { getToken, removeToken, setToken } from './utils';

type AuthState = {
  token: TokenType | null;
  status: 'idle' | 'signOut' | 'signIn';
  signIn: (data: TokenType) => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: (data: TokenType) => Promise<void>;
  hydrate: () => Promise<void>;
};

const _useAuthStore = create<AuthState>(set => ({
  token: null,
  status: 'idle',
  signIn: async (token) => {
    await setToken(token);
    set({ status: 'signIn', token });
  },
  signOut: async () => {
    await removeToken();
    set({ status: 'signOut', token: null });
  },
  refreshToken: async (token) => {
    await setToken(token);
    set({ token });
  },
  hydrate: async () => {
    const HYDRATE_TIMEOUT = 10_000;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

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
        set(result === null
          ? { status: 'signOut', token: null }
          : { status: 'signIn', token: result });
      }
    }
    catch (error) {
      // Clear timeout on error
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      console.error('Token hydration failed:', error);
      set({ status: 'signOut', token: null });
    }
  },
}));

export const useAuthStore = createSelectors(_useAuthStore);

export const signIn = (token: TokenType) => _useAuthStore.getState().signIn(token);
export const signOut = () => _useAuthStore.getState().signOut();
export const hydrateAuth = () => _useAuthStore.getState().hydrate();
