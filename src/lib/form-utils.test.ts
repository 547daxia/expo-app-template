import { getFieldError } from './form-utils';

function field(isTouched: boolean, errors: unknown[]) {
  return { state: { meta: { isTouched, errors } } };
}

describe('getFieldError', () => {
  it('hides errors until the field is touched', () => {
    expect(getFieldError(field(false, ['Required']))).toBeUndefined();
  });

  it('returns the first string error', () => {
    expect(getFieldError(field(true, ['Required', 'Ignored']))).toBe('Required');
  });

  it('reads object-shaped validation messages', () => {
    expect(getFieldError(field(true, [{ message: 'Invalid email' }]))).toBe(
      'Invalid email',
    );
  });
});
