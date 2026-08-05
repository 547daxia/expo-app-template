import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import type { TokenType } from '@/lib/auth/utils';
import axios from 'axios';

import Env from 'env';
import { getToken, removeToken, setToken } from '@/lib/auth/utils';

export const client = axios.create({
  baseURL: Env.EXPO_PUBLIC_API_URL,
  headers: { Accept: 'application/json' },
  timeout: 15_000,
});

// --- Token cache to avoid repeated SecureStore reads ---

let tokenCache: TokenType | null = null;

export function clearTokenCache() {
  tokenCache = null;
}

export function setTokenCache(token: TokenType | null) {
  tokenCache = token;
}

async function getTokenWithTimeout(timeoutMs = 5_000): Promise<TokenType | null> {
  if (tokenCache !== null) {
    return tokenCache;
  }

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<null>((resolve) => {
    timeoutId = setTimeout(resolve, timeoutMs, null);
  });

  try {
    const result = await Promise.race([getToken(), timeoutPromise]);

    // Cache the result for future requests.
    if (result !== null) {
      tokenCache = result;
    }

    return result;
  }
  finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
}

// --- Request interceptor: inject access token ---

client.interceptors.request.use(async (config) => {
  const token = await getTokenWithTimeout();
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
      const token = await getTokenWithTimeout();
      if (!token?.refresh) {
        throw new Error('No refresh token available');
      }

      const { data } = await axios.post<{ access: string; refresh: string }>(
        `${Env.EXPO_PUBLIC_API_URL}/auth/refresh`,
        { refresh: token.refresh },
      );

      await setToken({ access: data.access, refresh: data.refresh });
      // Update cache with new token
      setTokenCache({ access: data.access, refresh: data.refresh });

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
      }
      processQueue(null, data.access);

      return client(originalRequest);
    }
    catch (refreshError) {
      processQueue(refreshError, null);
      // Clear cache on refresh failure
      clearTokenCache();

      // signOut clears both secure storage and auth state. Guard it so a
      // storage failure never masks the original refresh error we must reject.
      try {
        const { signOut } = await import('@/features/auth/use-auth-store');
        await signOut();
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
