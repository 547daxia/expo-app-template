import { cleanup, render, screen } from '@/lib/test-utils';
import { StyleScreen } from './style-screen';

afterEach(cleanup);

describe('style screen', () => {
  it('renders the complete component catalog', () => {
    render(<StyleScreen />);

    expect(screen.getByText('59 component groups')).toBeOnTheScreen();
    expect(screen.getByText('Forms and controls')).toBeOnTheScreen();
    expect(screen.getByText('Component inventory')).toBeOnTheScreen();
  });
});
