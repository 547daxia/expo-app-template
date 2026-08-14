import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

import { cleanup, render, screen } from '@/lib/test-utils';
import AppLayout from './app/(app)/_layout';

let mockAuthStatus: 'idle' | 'signOut' | 'signIn' = 'signIn';
let mockIsFirstTime = false;

jest.mock('expo-router', () => {
  const React = require('react');
  const { Text } = require('react-native');

  function Stack({ children }: { children: React.ReactNode }) {
    return children;
  }
  Stack.Screen = () => null;

  return {
    Redirect: ({ href }: { href: string }) => (
      React.createElement(Text, { testID: 'redirect-target' }, href)
    ),
    Stack,
  };
});
jest.mock('@/lib/auth/session-store', () => ({
  useAuthStore: { use: { status: () => mockAuthStatus } },
}));
jest.mock('@/lib/hooks/use-is-first-time', () => ({
  useIsFirstTime: () => [mockIsFirstTime, jest.fn()],
}));

function listFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
}

describe('authenticated application layout', () => {
  beforeEach(() => {
    mockAuthStatus = 'signIn';
    mockIsFirstTime = false;
  });

  afterEach(cleanup);

  it('redirects first-time users to onboarding', () => {
    mockIsFirstTime = true;

    render(<AppLayout />);

    expect(screen.getByTestId('redirect-target')).toHaveTextContent('/onboarding');
  });

  it('redirects signed-out users to login', () => {
    mockAuthStatus = 'signOut';

    render(<AppLayout />);

    expect(screen.getByTestId('redirect-target')).toHaveTextContent('/login');
  });

  it('waits for authentication hydration', () => {
    mockAuthStatus = 'idle';

    const view = render(<AppLayout />);

    expect(view.toJSON()).toBeNull();
  });

  it('mounts the application stack for signed-in returning users', () => {
    const view = render(<AppLayout />);

    expect(view.toJSON()).toBeNull();
    expect(screen.queryByTestId('redirect-target')).not.toBeOnTheScreen();
  });

  it('keeps every Feed route inside the guarded route group', () => {
    const appDirectory = path.join(process.cwd(), 'src/app');

    expect(existsSync(path.join(appDirectory, 'feed/[id].tsx'))).toBe(false);
    expect(existsSync(path.join(appDirectory, 'feed/add-post.tsx'))).toBe(false);
    expect(existsSync(path.join(appDirectory, '(app)/feed/[id].tsx'))).toBe(true);
    expect(existsSync(path.join(appDirectory, '(app)/feed/add-post.tsx'))).toBe(true);
  });

  it('keeps test modules outside the Expo Router directory', () => {
    const appDirectory = path.join(process.cwd(), 'src/app');
    const testModules = listFiles(appDirectory).filter(file => (
      /\.(?:spec|test)\.[jt]sx?$/.test(file)
    ));

    expect(testModules).toEqual([]);
  });
});
