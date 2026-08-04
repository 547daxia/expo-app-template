// Web applications should use server-managed, HttpOnly cookies for persistent
// sessions. The template intentionally does not persist bearer tokens in
// localStorage, IndexedDB, or another JavaScript-readable browser store.
export async function getTokenValue() {
  return null;
}

export async function removeTokenValue() {}

export async function setTokenValue(_value: string) {}
