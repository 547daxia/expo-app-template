import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'auth-token';

export function getTokenValue() {
  return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
}

export function removeTokenValue() {
  return SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
}

export function setTokenValue(value: string) {
  return SecureStore.setItemAsync(AUTH_TOKEN_KEY, value);
}
