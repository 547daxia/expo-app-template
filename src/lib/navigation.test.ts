import { router } from 'expo-router';

import { navigate } from './navigation';

jest.mock('expo-router', () => ({
  __esModule: true,
  router: {
    back: jest.fn(),
    canDismiss: jest.fn(),
    canGoBack: jest.fn(),
    dismiss: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

const mockedRouter = router as jest.Mocked<typeof router>;

describe('navigate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    navigate.unlock();
  });

  afterEach(() => {
    navigate.unlock();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('locks repeated navigation to the same target within the lock window', () => {
    expect(navigate.push('/login')).toBe(true);
    expect(navigate.push('/login')).toBe(false);

    expect(mockedRouter.push).toHaveBeenCalledTimes(1);
    expect(mockedRouter.push).toHaveBeenCalledWith('/login');
  });

  it('allows a different target while the previous target is locked', () => {
    expect(navigate.push('/login')).toBe(true);
    expect(navigate.push('/feed/add-post')).toBe(true);

    expect(mockedRouter.push).toHaveBeenNthCalledWith(1, '/login');
    expect(mockedRouter.push).toHaveBeenNthCalledWith(2, '/feed/add-post');
  });

  it('unlocks after the configured duration', () => {
    expect(navigate.push('/login', { lockDuration: 250 })).toBe(true);

    jest.advanceTimersByTime(250);

    expect(navigate.isLocked()).toBe(false);
    expect(navigate.replace('/')).toBe(true);
  });

  it('allows forced navigation to the same target and refreshes the lock timer', () => {
    expect(navigate.push('/login')).toBe(true);

    jest.advanceTimersByTime(300);
    expect(navigate.forcePush('/login')).toBe(true);

    jest.advanceTimersByTime(300);
    expect(navigate.push('/login')).toBe(false);

    jest.advanceTimersByTime(200);
    expect(navigate.push('/login')).toBe(true);
    expect(mockedRouter.push).toHaveBeenNthCalledWith(2, '/login');
    expect(mockedRouter.push).toHaveBeenNthCalledWith(3, '/login');
  });

  it('releases the lock when Expo Router throws', () => {
    mockedRouter.push.mockImplementationOnce(() => {
      throw new Error('push failed');
    });

    expect(() => navigate.push('/login')).toThrow('push failed');
    expect(navigate.isLocked()).toBe(false);
  });
});
