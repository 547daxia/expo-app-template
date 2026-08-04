import { showMessage } from 'react-native-flash-message';

import { cleanup, screen, setup, waitFor } from '@/lib/test-utils';
import { SettingsScreen } from './settings-screen';

const mockSignOut = jest.fn();

jest.mock('env', () => ({
  __esModule: true,
  default: {
    EXPO_PUBLIC_APP_URL: undefined,
    EXPO_PUBLIC_NAME: 'Test App',
    EXPO_PUBLIC_VERSION: '1.0.0',
  },
}));
jest.mock('react-native-flash-message', () => ({ showMessage: jest.fn() }));
jest.mock('modules/expo-template-native', () => ({
  getNativeRuntimeInfo: () => ({ platform: 'ios', systemVersion: '16.4' }),
}));
jest.mock('@/features/auth/use-auth-store', () => ({
  useAuthStore: { use: { signOut: () => mockSignOut } },
}));
jest.mock('./components/theme-item', () => ({ ThemeItem: () => null }));

const mockShowMessage = jest.mocked(showMessage);

describe('settings screen', () => {
  beforeEach(() => {
    mockSignOut.mockReset().mockResolvedValue(undefined);
    mockShowMessage.mockClear();
  });

  afterEach(cleanup);

  it('signs out when persisted credentials are removed', async () => {
    const { user } = setup(<SettingsScreen />);

    await user.press(screen.getByText('Logout'));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockShowMessage).not.toHaveBeenCalled();
    expect(screen.getByText('ios 16.4')).toBeOnTheScreen();
  });

  it('reports when persisted credentials cannot be removed', async () => {
    mockSignOut.mockRejectedValue(new Error('Secure storage unavailable'));
    const { user } = setup(<SettingsScreen />);

    await user.press(screen.getByText('Logout'));

    await waitFor(() => expect(mockShowMessage).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Unable to sign out.',
      type: 'danger',
    })));
  });
});
