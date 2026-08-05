import { AxiosError } from 'axios';

import { getApiErrorMessage, isApiError } from './errors';

describe('aPI error mapping', () => {
  it('recognizes axios errors', () => {
    expect(isApiError(new AxiosError('Request failed'))).toBe(true);
    expect(isApiError(new Error('Network failure'))).toBe(false);
  });

  it('prefers a server-provided message', () => {
    const error = new AxiosError('Request failed with status code 400', undefined, undefined, undefined, {
      status: 400,
      data: { message: 'Title must contain at least 10 characters' },
    } as never);

    expect(getApiErrorMessage(error)).toBe('Title must contain at least 10 characters');
  });

  it('falls back to the axios message when the server sends none', () => {
    const error = new AxiosError('Request failed with status code 500', undefined, undefined, undefined, {
      status: 500,
      data: undefined,
    } as never);

    expect(getApiErrorMessage(error)).toBe('Request failed with status code 500');
  });

  it('falls back to the generic message for unknown errors', () => {
    expect(getApiErrorMessage(new Error('boom'))).toBe('boom');
    expect(getApiErrorMessage(undefined)).toBe('Something went wrong. Please try again.');
    expect(getApiErrorMessage(undefined, 'Custom fallback')).toBe('Custom fallback');
  });
});
