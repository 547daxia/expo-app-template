/** @jest-environment jsdom */
import { Platform, Text } from 'react-native';
import { Uniwind } from 'uniwind';

import { act, cleanup, render, screen } from '@/lib/test-utils';
import { AppUIProvider } from './app-ui-provider';

afterEach(() => {
  cleanup();
  Uniwind.setTheme('system');
  document.documentElement.className = '';
  document.documentElement.removeAttribute('style');
  jest.restoreAllMocks();
});

it('reflects theme changes on the document without overriding system mode', () => {
  jest.replaceProperty(Platform, 'OS', 'web');
  Uniwind.setTheme('system');
  document.documentElement.className = 'app-shell dark';

  render(<AppUIProvider><Text>Application content</Text></AppUIProvider>);

  expect(screen.getByText('Application content')).toBeOnTheScreen();
  expect(Uniwind.hasAdaptiveThemes).toBe(true);
  expect(document.documentElement.classList.contains(Uniwind.currentTheme)).toBe(true);

  act(() => Uniwind.setTheme('dark'));
  expect(document.documentElement.classList.contains('dark')).toBe(true);
  expect(document.documentElement.classList.contains('light')).toBe(false);
  expect(document.documentElement.style.colorScheme).toBe('dark');

  act(() => Uniwind.setTheme('light'));
  expect(document.documentElement.classList.contains('light')).toBe(true);
  expect(document.documentElement.classList.contains('dark')).toBe(false);
  expect(document.documentElement.style.colorScheme).toBe('light');
  expect(document.documentElement.classList.contains('app-shell')).toBe(true);

  act(() => Uniwind.setTheme('system'));
  expect(Uniwind.hasAdaptiveThemes).toBe(true);
});
