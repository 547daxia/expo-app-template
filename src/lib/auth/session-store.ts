import type { TokenType } from './utils';

import { create } from 'zustand';

import { createSelectors } from '@/lib/utils';
import { getToken, removeToken, setToken } from './utils';

type AuthState = {
  token: TokenType | null;
  status: 'idle' | 'signOut' | 'signIn';
  sessionId: number;
  signIn: (data: TokenType) => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: (data: TokenType, sessionId: number) => Promise<void>;
  hydrate: () => Promise<void>;
};

export class SessionChangedError extends Error {
  constructor() {
    super('The session changed while the request was running.');
    this.name = 'SessionChangedError';
  }
}

// Native storage operations cannot be aborted. A late write must finish before
// the following logout/removal or sign-in is allowed to touch storage.
let storageQueue: Promise<unknown> = Promise.resolve();
function withStorage<T>(operation: () => Promise<T>): Promise<T> {
  const result = storageQueue.then(operation);
  storageQueue = result.catch(() => {});
  return result;
}

function beginSession(): number {
  const sessionId = _useAuthStore.getState().sessionId + 1;
  _useAuthStore.setState({ sessionId, token: null, status: 'signOut' });
  return sessionId;
}

export function assertSession(sessionId: number) {
  if (_useAuthStore.getState().sessionId !== sessionId) {
    throw new SessionChangedError();
  }
}

async function endSession(expectedSessionId: number, attempts: number) {
  if (_useAuthStore.getState().sessionId !== expectedSessionId) {
    return;
  }
  beginSession();
  await withStorage(async () => {
    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        await removeToken();
        return;
      }
      catch (error) {
        if (attempt === attempts - 1) {
          throw error;
        }
      }
    }
  });
}

let hydration: Promise<void> | undefined;
async function restoreSession() {
  const { sessionId } = _useAuthStore.getState();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    const token = await Promise.race([
      getToken(),
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Token hydration timed out after 10000 ms')), 10_000);
      }),
    ]);
    assertSession(sessionId);
    _useAuthStore.setState({ token, status: token ? 'signIn' : 'signOut' });
  }
  catch (error) {
    if (_useAuthStore.getState().sessionId === sessionId) {
      console.error('Token hydration failed:', error);
      _useAuthStore.setState({ token: null, status: 'signOut' });
    }
  }
  finally {
    clearTimeout(timeoutId);
  }
}

const _useAuthStore = create<AuthState>(() => ({
  token: null,
  status: 'idle',
  sessionId: 0,
  signIn: async (token) => {
    const sessionId = beginSession();
    await withStorage(async () => {
      assertSession(sessionId);
      await setToken(token);
      assertSession(sessionId);
      _useAuthStore.setState({ status: 'signIn', token });
    });
  },
  signOut: (): Promise<void> => endSession(_useAuthStore.getState().sessionId, 1),
  refreshToken: async (token, sessionId) => {
    await withStorage(async () => {
      assertSession(sessionId);
      if (_useAuthStore.getState().status !== 'signIn') {
        throw new SessionChangedError();
      }
      await setToken(token);
      assertSession(sessionId);
      _useAuthStore.setState({ token });
    });
  },
  hydrate: () => {
    if (_useAuthStore.getState().status !== 'idle') {
      return Promise.resolve();
    }
    hydration ??= restoreSession().finally(() => {
      hydration = undefined;
    });
    return hydration;
  },
}));

export const useAuthStore = createSelectors(_useAuthStore);
export const signIn = (token: TokenType) => _useAuthStore.getState().signIn(token);
export const signOut = () => _useAuthStore.getState().signOut();
export const hydrateAuth = () => _useAuthStore.getState().hydrate();
export const invalidateSession = (sessionId: number) => endSession(sessionId, 2);
