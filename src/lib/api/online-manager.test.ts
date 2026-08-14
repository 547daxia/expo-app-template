import type { NetInfoState } from '@react-native-community/netinfo';

import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import { Platform } from 'react-native';

import { configureOnlineManager } from './online-manager';

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: { addEventListener: jest.fn() },
}));

const mockAddEventListener = jest.mocked(NetInfo.addEventListener);

describe('react query online manager', () => {
  const originalPlatform = Platform.OS;

  beforeEach(() => {
    mockAddEventListener.mockReset();
  });

  afterEach(() => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: originalPlatform });
    jest.restoreAllMocks();
  });

  it('bridges native connectivity changes into TanStack Query', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'ios' });
    const setOnline = jest.fn();
    const unsubscribe = jest.fn();
    let handleState: ((state: NetInfoState) => void) | undefined;
    mockAddEventListener.mockImplementation((listener) => {
      handleState = listener;
      return unsubscribe;
    });
    jest.spyOn(onlineManager, 'setEventListener').mockImplementation((setup) => {
      expect(setup(setOnline)).toBe(unsubscribe);
    });

    configureOnlineManager();
    handleState?.({ isConnected: true, isInternetReachable: null } as NetInfoState);
    handleState?.({ isConnected: true, isInternetReachable: false } as NetInfoState);

    expect(mockAddEventListener).toHaveBeenCalledTimes(1);
    expect(setOnline).toHaveBeenNthCalledWith(1, true);
    expect(setOnline).toHaveBeenNthCalledWith(2, false);
  });

  it('keeps TanStack Query browser listeners on Web', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'web' });
    const setEventListener = jest.spyOn(onlineManager, 'setEventListener');

    configureOnlineManager();

    expect(setEventListener).not.toHaveBeenCalled();
    expect(mockAddEventListener).not.toHaveBeenCalled();
  });
});
