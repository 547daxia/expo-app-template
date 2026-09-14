import { z } from 'zod';

import { getTokenValue, removeTokenValue, setTokenValue } from './token-storage';

const tokenSchema = z.object({
  access: z.string().min(1),
  refresh: z.string().min(1),
});

export type TokenType = z.infer<typeof tokenSchema>;

export async function getToken() {
  const value = await getTokenValue();
  if (value === null) {
    return null;
  }

  try {
    const parsed = tokenSchema.safeParse(JSON.parse(value));
    if (parsed.success) {
      return parsed.data;
    }
  }
  catch {
    // Invalid credentials are ignored. Reads never mutate storage, so a slow
    // hydration read cannot delete credentials from a newer sign-in.
  }

  return null;
}

export const removeToken = () => removeTokenValue();

export function setToken(value: TokenType) {
  return setTokenValue(JSON.stringify(tokenSchema.parse(value)));
}
