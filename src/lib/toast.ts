import { showMessage } from 'react-native-flash-message';

import { getApiErrorMessage } from '@/lib/api/errors';

type ToastType = 'success' | 'danger' | 'info' | 'warning';
type ToastPosition = 'top' | 'bottom' | 'center';

export function showToast(
  message: string,
  type: ToastType = 'info',
  position: ToastPosition = 'top',
) {
  showMessage({ message, type, position });
}

export function showErrorToast(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
) {
  showToast(getApiErrorMessage(error, fallback), 'danger');
}
