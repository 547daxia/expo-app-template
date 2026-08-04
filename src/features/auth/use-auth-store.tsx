import type { TokenType } from '@/lib/auth/utils';

import { create } from 'zustand';
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
    set({ status: 'signIn', token });
  },
  signOut: async () => {
    await removeToken();
    set({ status: 'signOut', token: null });
  },
  hydrate: async () => {
    try {
      const userToken = await getToken();
      set(userToken === null
        ? { status: 'signOut', token: null }
        : { status: 'signIn', token: userToken });
    }
    catch (e) {
      console.error(e);
      set({ status: 'signOut', token: null });
    }
  },
}));

export const useAuthStore = createSelectors(_useAuthStore);

export const signOut = () => _useAuthStore.getState().signOut();
export const signIn = (token: TokenType) => _useAuthStore.getState().signIn(token);
export const hydrateAuth = () => _useAuthStore.getState().hydrate();
