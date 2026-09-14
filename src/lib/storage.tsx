import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

export function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  if (value === undefined || value.length === 0) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  }
  catch {
    return null;
  }
}

/** Read a value written directly through MMKV without JSON deserialization. */
export function getString(key: string): string | null {
  return storage.getString(key) ?? null;
}

export function setItem<T>(key: string, value: T) {
  const serialized = JSON.stringify(value);
  if (serialized === undefined) {
    throw new TypeError('Storage values must be JSON serializable.');
  }

  storage.set(key, serialized);
}

export function removeItem(key: string) {
  storage.remove(key);
}
