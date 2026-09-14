import { cleanup, render, screen } from '@/lib/test-utils';

import { DatePicker } from './index';

afterEach(cleanup);

describe('date picker', () => {
  it('renders its field label and controlled value', () => {
    const value = new Date(2026, 7, 3);

    render(<DatePicker label="Birthday" testID="birthday" value={value} />);

    expect(screen.getByTestId('birthday-label')).toHaveTextContent('Birthday');
    expect(screen.getByTestId('birthday-trigger')).toBeOnTheScreen();
    expect(screen.getByTestId('birthday-input')).toBeOnTheScreen();
  });

  it('renders validation feedback', () => {
    render(
      <DatePicker
        error="Choose a valid date"
        testID="birthday"
        value={new Date(2026, 7, 3)}
      />,
    );

    expect(screen.getByTestId('birthday-error')).toHaveTextContent(
      'Choose a valid date',
    );
  });
});
