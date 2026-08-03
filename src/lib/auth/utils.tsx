import { z } from 'zod';

import { getItem, removeItem, setItem } from '@/lib/storage';

const TOKEN = 'token';

const tokenSchema = z.object({
  access: z.string().min(1),
  refresh: z.string().min(1),
});

export type TokenType = z.infer<typeof tokenSchema>;

export function getToken() {
  const value = getItem<unknown>(TOKEN);
  const parsed = tokenSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}
export const removeToken = () => removeItem(TOKEN);
export const setToken = (value: TokenType) => setItem<TokenType>(TOKEN, value);
