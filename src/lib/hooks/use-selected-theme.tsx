import * as React from 'react';
import { useMMKVString } from 'react-native-mmkv';
import { Uniwind } from 'uniwind';

import { storage } from '@/lib/storage';

const SELECTED_THEME = 'SELECTED_THEME';
export type ColorSchemeType = 'light' | 'dark' | 'system';

function resolvePreference(value: string | undefined): ColorSchemeType {
  return value === 'light' || value === 'dark' ? value : 'system';
}
/**
 * this hooks should only be used while selecting the theme
 * This hooks will return the selected theme which is stored in MMKV
 * selectedTheme should be one of the following values 'light', 'dark' or 'system'
 * don't use this hooks if you want to use it to style your component based on the theme use useUniwind from uniwind instead
 *
 */
export function useSelectedTheme() {
  const [theme, _setTheme] = useMMKVString(SELECTED_THEME, storage);

  const setSelectedTheme = React.useCallback(
    (t: ColorSchemeType) => {
      Uniwind.setTheme(t);
      _setTheme(t);
    },
    [_setTheme],
  );

  const selectedTheme = resolvePreference(theme);
  return { selectedTheme, setSelectedTheme } as const;
}
// to be used in the root file to load the selected theme from MMKV
export function loadSelectedTheme() {
  Uniwind.setTheme(resolvePreference(storage.getString(SELECTED_THEME)));
}
