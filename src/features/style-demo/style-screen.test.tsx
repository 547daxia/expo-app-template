import { cleanup, render, screen } from '@/lib/test-utils';
import { COMPONENT_GROUPS } from './components/component-groups';
import { StyleScreen } from './style-screen';

afterEach(cleanup);

describe('style screen', () => {
  it('renders the complete component catalog', () => {
    render(<StyleScreen />);

    expect(screen.getByTestId('style-catalog-count')).toHaveTextContent(
      `${COMPONENT_GROUPS.length} component groups`,
    );
    expect(screen.getByText('Forms and controls')).toBeOnTheScreen();
    expect(screen.getByText('Component inventory')).toBeOnTheScreen();
  });
});
