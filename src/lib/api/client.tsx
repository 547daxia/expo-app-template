import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import axios from 'axios';

import Env from 'env';
import { useAuthStore } from '@/lib/auth/session-store';
import { removeToken } from '@/lib/auth/utils';

// Axios defaults ---------------------------------------------------------------

const DEFAULT_TIMEOUT_MS = 15_000;

// Token-refresh endpoint. The template contract defaults to
// `<API_URL>/auth/refresh`; a project can override it with
// `EXPO_PUBLIC_AUTH_REFRESH_URL` without touching this code.
const AUTH_REFRESH_URL = Env.EXPO_PUBLIC_AUTH_REFRESH_URL
  ?? `${Env.EXPO_PUBLIC_API_URL}/auth/refresh`;

export const client = axios.create({
  baseURL: Env.EXPO_PUBLIC_API_URL,
  headers: { Accept: 'application/json' },
  timeout: DEFAULT_TIMEOUT_MS,
});

// --- Request interceptor: inject the access token ---
// The session store is the single source of truth for credentials. The root
// layout hydrates it before any authenticated screen mounts, so a synchronous
// read is sufficient here.

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token.access}`;
  }
  return config;
});

// --- Response interceptor: 401 token refresh ---

type FailedRequest = {
  resolve: (config: InternalAxiosRequestConfig) => void;
  reject: (error: unknown) => void;
  config: InternalAxiosRequestConfig;
};

type RetriableRequest = InternalAxiosRequestConfig & { __isRetry?: boolean };

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

function processQueue(error: unknown, newAccessToken: string | null) {
  for (const request of failedQueue) {
    if (newAccessToken && request.config.headers) {
      request.config.headers.Authorization = `Bearer ${newAccessToken}`;
      request.resolve(request.config);
    }
    else {
      request.reject(error);
    }
  }
  failedQueue = [];
}

client.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequest | undefined;
    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite loops on refresh endpoint itself
    if (originalRequest.__isRetry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // A queued request has already received a 401. Mark it now so a retry
      // that also receives a 401 cannot start a second refresh cycle.
      originalRequest.__isRetry = true;
      return new Promise<InternalAxiosRequestConfig>((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      }).then(config => client(config));
    }

    originalRequest.__isRetry = true;
    isRefreshing = true;

    try {
      const token = useAuthStore.getState().token;
      if (!token?.refresh) {
        throw new Error('No refresh token available');
      }

      const { data } = await axios.post<{ access: string; refresh: string }>(
        AUTH_REFRESH_URL,
        { refresh: token.refresh },
      );

      // Persist the rotated pair and update the session in one step.
      await useAuthStore.getState().refreshToken({
        access: data.access,
        refresh: data.refresh,
      });

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
      }
      processQueue(null, data.access);

      return client(originalRequest);
    }
    catch (refreshError) {
      processQueue(refreshError, null);

      // signOut removes persisted credentials and clears auth state. Guard it
      // so a storage failure never masks the original refresh error we must
      // reject.
      try {
        await useAuthStore.getState().signOut();
      }
      catch {
        try {
          await removeToken();
        }
        catch {
          // Preserve the refresh error when secure storage is unavailable.
        }
      }
      return Promise.reject(refreshError);
    }
    finally {
      isRefreshing = false;
    }
  },
);
