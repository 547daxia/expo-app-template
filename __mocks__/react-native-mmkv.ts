const stores = new Map<string, Map<string, string | number | boolean>>();

function getStore(id = 'mmkv.default') {
  const existingStore = stores.get(id);
  if (existingStore) {
    return existingStore;
  }

  const store = new Map<string, string | number | boolean>();
  stores.set(id, store);
  return store;
}

export function createMMKV({ id }: { id?: string } = {}) {
  const store = getStore(id);

  return {
    clearAll: () => store.clear(),
    getAllKeys: () => [...store.keys()],
    getBoolean: (key: string) => {
      const value = store.get(key);
      return typeof value === 'boolean' ? value : undefined;
    },
    getNumber: (key: string) => {
      const value = store.get(key);
      return typeof value === 'number' ? value : undefined;
    },
    getString: (key: string) => {
      const value = store.get(key);
      return typeof value === 'string' ? value : undefined;
    },
    remove: (key: string) => store.delete(key),
    set: (key: string, value: string | number | boolean) => {
      store.set(key, value);
    },
  };
}

export function useMMKVString() {
  return [undefined, jest.fn()] as const;
}

export function useMMKVNumber() {
  return [undefined, jest.fn()] as const;
}

export function useMMKVBoolean() {
  return [undefined, jest.fn()] as const;
}

export function useMMKVObject() {
  return [undefined, jest.fn()] as const;
}
