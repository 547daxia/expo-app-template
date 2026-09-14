import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import axios from 'axios';
import Env from 'env';

import { assertSession, invalidateSession, useAuthStore } from '@/lib/auth/session-store';

const DEFAULT_TIMEOUT_MS = 15_000;
const AUTH_REFRESH_URL = Env.EXPO_PUBLIC_AUTH_REFRESH_URL
  ?? `${Env.EXPO_PUBLIC_API_URL.replace(/\/$/, '')}/auth/refresh`;

export const client = axios.create({
  baseURL: Env.EXPO_PUBLIC_API_URL,
  headers: { Accept: 'application/json' },
  timeout: DEFAULT_TIMEOUT_MS,
});

type SessionRequest = InternalAxiosRequestConfig & {
  __sessionId?: number;
  __accessToken?: string;
  __isRetry?: boolean;
};

client.interceptors.request.use((config: SessionRequest) => {
  const { token, sessionId } = useAuthStore.getState();
  config.__sessionId ??= sessionId;
  assertSession(config.__sessionId);
  config.__accessToken = token?.access;
  if (token) {
    config.headers.Authorization = `Bearer ${token.access}`;
  }
  return config;
});

// A new account never joins an old account's refresh. Late responses cannot
// persist credentials, replay old requests, or invalidate the new session.
const refreshes = new Map<number, Promise<void>>();
async function refreshSession(sessionId: number) {
  try {
    assertSession(sessionId);
    const token = useAuthStore.getState().token;
    if (!token?.refresh) {
      throw new Error('No refresh token available');
    }
    const { data } = await axios.post<{ access: string; refresh: string }>(
      AUTH_REFRESH_URL,
      { refresh: token.refresh },
      { timeout: DEFAULT_TIMEOUT_MS },
    );
    assertSession(sessionId);
    await useAuthStore.getState().refreshToken(data, sessionId);
  }
  catch (error) {
    // Revoke memory immediately; preserve the original error even if storage
    // remains unavailable after both deletion attempts.
    await invalidateSession(sessionId).catch(() => {});
    throw error;
  }
}

function ensureRefresh(sessionId: number) {
  let refresh = refreshes.get(sessionId);
  if (!refresh) {
    refresh = refreshSession(sessionId).finally(() => refreshes.delete(sessionId));
    refreshes.set(sessionId, refresh);
  }
  return refresh;
}

client.interceptors.response.use(
  (response) => {
    assertSession((response.config as SessionRequest).__sessionId!);
    return response;
  },
  async (error: AxiosError) => {
    const request = error.config as SessionRequest | undefined;
    if (!request) {
      return Promise.reject(error);
    }
    const sessionId = request.__sessionId!;
    assertSession(sessionId);
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }
    if (request.__isRetry) {
      await invalidateSession(sessionId).catch(() => {});
      return Promise.reject(error);
    }
    request.__isRetry = true;
    const currentAccess = useAuthStore.getState().token?.access;
    // A delayed 401 for the previous access token can use the rotated token.
    if (!currentAccess || currentAccess === request.__accessToken) {
      await ensureRefresh(sessionId);
    }
    assertSession(sessionId);
    return client(request);
  },
);
