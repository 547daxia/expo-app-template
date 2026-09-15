import { DeviceEventEmitter } from 'react-native';
import { Uniwind } from 'uniwind';

import { loadSelectedTheme } from '@/lib/hooks/use-selected-theme';
import { storage } from '@/lib/storage';
import { act, cleanup, render, screen, setup, waitFor } from '@/lib/test-utils';
import RootLayout, { ErrorBoundary } from './app/_layout';

jest.mock('expo-router', () => {
  function Stack({ children }: { children: React.ReactNode }) {
    return children;
  }

  Stack.Screen = () => null;

  return { Stack };
});
jest.mock('expo-splash-screen', () => ({
  hide: jest.fn(),
  preventAutoHideAsync: jest.fn(),
  setOptions: jest.fn(),
}));
jest.mock('./global.css', () => ({}));
jest.mock('react-native/Libraries/Utilities/NativeAppearance', () => ({
  __esModule: true,
  default: {
    getColorScheme: () => 'light',
    setColorScheme: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
}));
jest.mock('react-native-gesture-handler', () => ({
  ...require('react-native-gesture-handler/src/mocks/mocks'),
  GestureHandlerRootView: require('react-native').View,
}));
jest.mock('@/lib/auth/session-store', () => ({
  hydrateAuth: jest.fn(),
  useAuthStore: { use: { status: () => 'signOut' } },
}));
jest.mock('@/lib/api', () => ({
  APIProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('root theme preference', () => {
  beforeEach(() => {
    storage.remove('SELECTED_THEME');
  });

  afterEach(() => {
    cleanup();
    storage.remove('SELECTED_THEME');
    Uniwind.setTheme('system');
  });

  it.each([undefined, 'system', 'obsolete-theme'])(
    'keeps adaptive themes after mounting with saved preference %s',
    (savedTheme) => {
      if (savedTheme !== undefined) {
        storage.set('SELECTED_THEME', savedTheme);
      }
      // Restore after a fixed theme to exercise startup and missing preferences.
      Uniwind.setTheme('dark');
      loadSelectedTheme();
      const { rerender } = render(<RootLayout />);

      expect(Uniwind.hasAdaptiveThemes).toBe(true);
      rerender(<RootLayout />);
      expect(Uniwind.hasAdaptiveThemes).toBe(true);
    },
  );

  it.each(['light', 'dark'] as const)('restores an explicit %s preference', (theme) => {
    storage.set('SELECTED_THEME', theme);
    loadSelectedTheme();
    render(<RootLayout />);

    expect(Uniwind.currentTheme).toBe(theme);
    expect(Uniwind.hasAdaptiveThemes).toBe(false);

    act(() => DeviceEventEmitter.emit('appearanceChanged', {
      colorScheme: theme === 'light' ? 'dark' : 'light',
    }));
    expect(Uniwind.currentTheme).toBe(theme);
  });

  it('keeps system mode enabled after changing from a fixed theme', () => {
    Uniwind.setTheme('dark');
    render(<RootLayout />);

    act(() => Uniwind.setTheme('system'));

    expect(Uniwind.hasAdaptiveThemes).toBe(true);
  });

  it('follows system appearance changes while mounted', () => {
    loadSelectedTheme();
    render(<RootLayout />);

    act(() => DeviceEventEmitter.emit('appearanceChanged', { colorScheme: 'dark' }));
    expect(Uniwind.currentTheme).toBe('dark');
    expect(Uniwind.hasAdaptiveThemes).toBe(true);

    act(() => DeviceEventEmitter.emit('appearanceChanged', { colorScheme: 'light' }));
    expect(Uniwind.currentTheme).toBe('light');
    expect(Uniwind.hasAdaptiveThemes).toBe(true);
  });
});

describe('root error boundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  it('hides internal errors and exposes a retry action', async () => {
    const retry = jest.fn().mockResolvedValue(undefined);
    const { user } = setup(
      <ErrorBoundary error={new Error('Internal API detail')} retry={retry} />,
    );

    expect(screen.queryByText('Internal API detail')).not.toBeOnTheScreen();
    expect(screen.getByText(
      'The application encountered an unexpected error. Please try again.',
    )).toBeOnTheScreen();
    await waitFor(() => expect(console.error).toHaveBeenCalledWith(
      'Unhandled application error',
      expect.any(Error),
    ));

    await user.press(screen.getByText('Try Again'));
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
