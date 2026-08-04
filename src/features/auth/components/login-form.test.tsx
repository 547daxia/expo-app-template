import { cleanup, screen, setup, waitFor } from '@/lib/test-utils';
import { LoginForm } from './login-form';

afterEach(cleanup);

describe('login form', () => {
  it('renders the sign-in form', () => {
    setup(<LoginForm />);

    expect(screen.getByTestId('form-title')).toHaveTextContent('Sign In');
    expect(screen.getByTestId('login-button')).toBeOnTheScreen();
  });

  it('shows required validation feedback', async () => {
    const { user } = setup(<LoginForm />);

    await user.press(screen.getByTestId('login-button'));

    expect(await screen.findByText('Email is required')).toBeOnTheScreen();
    expect(screen.getByText('Password is required')).toBeOnTheScreen();
  });

  it('submits valid credentials', async () => {
    const onSubmit = jest.fn();
    const { user } = setup(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByTestId('email-input'), 'user@example.com');
    await user.type(screen.getByTestId('password-input'), 'password');
    await user.press(screen.getByTestId('login-button'));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password',
    });
  });
});
