import type { Theme } from 'expo-router/react-navigation';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
} from 'expo-router/react-navigation';
import { useUniwind } from 'uniwind';

const darkTheme: Theme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: '#ff984c',
    background: '#121212',
    card: '#2e2e2e',
    text: '#e5e5e5',
    border: '#7d7d7d',
  },
};

const lightTheme: Theme = {
  ...NavigationLightTheme,
  colors: {
    ...NavigationLightTheme.colors,
    primary: '#ff8933',
    background: '#ffffff',
  },
};

export function useThemeConfig() {
  const { theme } = useUniwind();

  return theme === 'dark' ? darkTheme : lightTheme;
}
