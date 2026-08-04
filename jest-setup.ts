Object.defineProperty(globalThis, 'window', {
  configurable: true,
  value: globalThis,
  writable: true,
});

// Worklets uses a native runtime in the app; use the package-provided mock.
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));

// MMKV loads Nitro before its internal test fallback can be selected. Use an
// in-memory manual mock so storage behavior remains testable without native code.
jest.mock('react-native-mmkv');

// Vector icon fonts load asynchronously on device. The mock keeps component
// tests deterministic without initializing native font loading.
jest.mock('@expo/vector-icons');

jest.mock('@legendapp/motion', () => {
  const { View } = require('react-native');

  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    createMotionAnimatedComponent: (Component: React.ComponentType) => Component,
    Motion: { View },
  };
});

// TanStack Form starts a devtools connection interval when a form mounts. The
// devtools event bus is not part of unit tests, so replace it with a no-op client
// to keep Jest's lifecycle deterministic.
jest.mock('@tanstack/devtools-event-client', () => ({
  EventClient: class {
    emit() {}
    on() {
      return () => {};
    }
  },
}));

// Register Reanimated's matchers and animation test environment.
require('react-native-reanimated').setUpTests();

// Use the package-provided zero-inset defaults when a test does not mount the
// application's SafeAreaProvider.
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);
