import { cleanup, screen, setup, waitFor } from '@/lib/test-utils';
import { ErrorBoundary } from './app/_layout';

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
jest.mock('@/components/ui/gluestack-ui-provider/theme', () => ({
  useThemeConfig: () => ({ dark: false }),
}));
jest.mock('@/lib/auth/session-store', () => ({
  hydrateAuth: jest.fn(),
  useAuthStore: { use: { status: () => 'signOut' } },
}));
jest.mock('@/lib/api', () => ({
  APIProvider: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('@/lib/hooks/use-selected-theme', () => ({ loadSelectedTheme: jest.fn() }));

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
