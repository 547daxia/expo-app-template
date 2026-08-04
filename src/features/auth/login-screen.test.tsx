import Env from 'env';
import { showMessage } from 'react-native-flash-message';

import { navigate } from '@/lib/navigation';
import { cleanup, screen, setup, waitFor } from '@/lib/test-utils';
import { LoginScreen } from './login-screen';

const mockSignIn = jest.fn();

jest.mock('env', () => ({
  __esModule: true,
  default: { EXPO_PUBLIC_APP_ENV: 'development' },
}));
jest.mock('react-native-flash-message', () => ({ showMessage: jest.fn() }));
jest.mock('@/lib/navigation', () => ({
  navigate: { replace: jest.fn() },
}));
jest.mock('./use-auth-store', () => ({
  useAuthStore: { use: { signIn: () => mockSignIn } },
}));

const mockShowMessage = jest.mocked(showMessage);
const mockReplace = jest.mocked(navigate.replace);
const mockEnv = Env as { EXPO_PUBLIC_APP_ENV: string };

async function submitValidCredentials() {
  const { user } = setup(<LoginScreen />);
  await user.type(screen.getByTestId('email-input'), 'user@example.com');
  await user.type(screen.getByTestId('password-input'), 'password');
  await user.press(screen.getByTestId('login-button'));
}

describe('login screen', () => {
  beforeEach(() => {
    mockEnv.EXPO_PUBLIC_APP_ENV = 'development';
    mockSignIn.mockReset().mockResolvedValue(undefined);
    mockShowMessage.mockClear();
    mockReplace.mockClear();
  });

  afterEach(cleanup);

  it('stores a development session and enters the app', async () => {
    await submitValidCredentials();

    await waitFor(() => expect(mockSignIn).toHaveBeenCalledWith({
      access: 'access-token',
      refresh: 'refresh-token',
    }));
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('keeps demo authentication disabled in production', async () => {
    mockEnv.EXPO_PUBLIC_APP_ENV = 'production';

    await submitValidCredentials();

    expect(mockSignIn).not.toHaveBeenCalled();
    expect(mockShowMessage).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Demo authentication is disabled in production.',
      type: 'danger',
    }));
  });

  it('shows a recoverable error when secure storage is unavailable', async () => {
    mockSignIn.mockRejectedValue(new Error('Secure storage unavailable'));

    await submitValidCredentials();

    await waitFor(() => expect(mockShowMessage).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Unable to save the session.',
      type: 'danger',
    })));
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
