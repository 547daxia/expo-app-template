import type { Href } from 'expo-router';

import { router } from 'expo-router';

const DEFAULT_LOCK_DURATION = 500;

type NavigateOptions = {
  /** Time in milliseconds during which repeated navigation is ignored. */
  lockDuration?: number;
};

let isNavigating = false;
let activeNavigationKey: string | null = null;
let lockTimer: ReturnType<typeof setTimeout> | null = null;

function clearLockTimer() {
  if (lockTimer !== null) {
    clearTimeout(lockTimer);
    lockTimer = null;
  }
}

function unlock() {
  clearLockTimer();
  isNavigating = false;
  activeNavigationKey = null;
}

function getHrefKey(href: Href) {
  if (typeof href === 'string') {
    return href;
  }

  return JSON.stringify(href) ?? String(href);
}

function lock(key: string, lockDuration = DEFAULT_LOCK_DURATION) {
  isNavigating = true;
  activeNavigationKey = key;
  clearLockTimer();
  lockTimer = setTimeout(() => {
    isNavigating = false;
    activeNavigationKey = null;
    lockTimer = null;
  }, lockDuration);
}

function runNavigation(
  action: () => void,
  key: string,
  options?: NavigateOptions & { force?: boolean },
) {
  if (isNavigating && activeNavigationKey === key && !options?.force) {
    return false;
  }

  if (options?.force) {
    unlock();
  }

  lock(key, options?.lockDuration);

  try {
    action();
    return true;
  }
  catch (error) {
    unlock();
    throw error;
  }
}

/**
 * Imperative Expo Router navigation with a short global lock to prevent a
 * rapid double press from pushing the same screen more than once.
 * Declarative navigation should continue to use Expo Router's Link component.
 */
export const navigate = {
  push(href: Href, options?: NavigateOptions) {
    return runNavigation(() => router.push(href), `push:${getHrefKey(href)}`, options);
  },

  replace(href: Href, options?: NavigateOptions) {
    return runNavigation(() => router.replace(href), `replace:${getHrefKey(href)}`, options);
  },

  forcePush(href: Href, options?: NavigateOptions) {
    return runNavigation(
      () => router.push(href),
      `push:${getHrefKey(href)}`,
      { ...options, force: true },
    );
  },

  forceReplace(href: Href, options?: NavigateOptions) {
    return runNavigation(
      () => router.replace(href),
      `replace:${getHrefKey(href)}`,
      { ...options, force: true },
    );
  },

  back() {
    router.back();
  },

  canGoBack() {
    return router.canGoBack();
  },

  canDismiss() {
    return router.canDismiss();
  },

  dismiss(count?: number) {
    router.dismiss(count);
  },

  isLocked() {
    return isNavigating;
  },

  unlock,
};
