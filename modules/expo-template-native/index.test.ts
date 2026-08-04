import { getNativeRuntimeInfo } from './index';

jest.mock('expo', () => ({
  NativeModule: class NativeModule {},
  requireNativeModule: () => ({
    getRuntimeInfo: () => ({
      platform: 'android',
      systemVersion: '16',
    }),
  }),
}));

describe('expo template native module facade', () => {
  it('returns the native runtime contract', () => {
    expect(getNativeRuntimeInfo()).toEqual({
      platform: 'android',
      systemVersion: '16',
    });
  });
});
