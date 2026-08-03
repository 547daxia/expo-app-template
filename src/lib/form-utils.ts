type FieldWithErrors = {
  state: {
    meta: {
      isTouched: boolean;
      errors: unknown[];
    };
  };
};

export function getFieldError(field: FieldWithErrors): string | undefined {
  if (!field.state.meta.isTouched || field.state.meta.errors.length === 0) {
    return undefined;
  }

  const error = field.state.meta.errors[0];

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }

  return String(error);
}
