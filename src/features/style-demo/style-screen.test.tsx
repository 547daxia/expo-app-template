import { act, cleanup, render, screen } from '@/lib/test-utils';
import { COMPONENT_GROUPS, PROJECT_COMPONENT_GROUPS } from './components/component-groups';
import { StyleScreen } from './style-screen';

beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  cleanup();
  jest.useRealTimers();
});

describe('style screen', () => {
  it('renders the complete component catalog', async () => {
    render(<StyleScreen />);
    await act(async () => {
      await jest.advanceTimersByTimeAsync(200);
    });

    expect(screen.getByTestId('style-catalog-count')).toHaveTextContent(
      `${COMPONENT_GROUPS.length + PROJECT_COMPONENT_GROUPS.length} component groups`,
    );
    expect(screen.getByText('Forms and controls')).toBeOnTheScreen();
    expect(screen.getByText('Component inventory')).toBeOnTheScreen();
  });
});
