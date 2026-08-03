import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

const JSON_PREFIX = '__expo_app_template_json__:';

export function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  if (value === undefined || value.length === 0) {
    return null;
  }

  try {
    // Values written before the prefix was introduced were plain JSON, so keep
    // parsing them to avoid invalidating existing persisted state.
    const serialized = value.startsWith(JSON_PREFIX)
      ? value.slice(JSON_PREFIX.length)
      : value;
    return JSON.parse(serialized) as T;
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

  storage.set(key, `${JSON_PREFIX}${serialized}`);
}

export function removeItem(key: string) {
  storage.remove(key);
}
