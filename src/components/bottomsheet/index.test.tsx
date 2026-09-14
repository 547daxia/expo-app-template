import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { Text } from 'react-native';

import { cleanup, screen, setup, waitFor } from '@/lib/test-utils';
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetItem,
  BottomSheetPortal,
  BottomSheetTrigger,
} from './index';

// Native layout/animation is outside this test; dismissal must not depend on
// the native sheet eventually delivering an onChange(-1) callback.
jest.mock('@gorhom/bottom-sheet', () => {
  const { View } = require('react-native');
  return {
    ...jest.requireActual('@gorhom/bottom-sheet'),
    __esModule: true,
    default: View,
    BottomSheetView: View,
  };
});

afterEach(cleanup);

it('dismisses on item selection and can open again without a native callback', async () => {
  const onClose = jest.fn();
  const { user } = setup(
    <OverlayProvider>
      <BottomSheet onClose={onClose}>
        <BottomSheetTrigger accessibilityRole="button"><Text>Open sheet</Text></BottomSheetTrigger>
        <BottomSheetPortal snapPoints={['50%']}>
          <BottomSheetContent>
            <BottomSheetItem><Text>Choose action</Text></BottomSheetItem>
          </BottomSheetContent>
        </BottomSheetPortal>
      </BottomSheet>
    </OverlayProvider>,
  );
  await user.press(screen.getByText('Open sheet'));
  await user.press(await screen.findByText('Choose action'));
  await waitFor(() => expect(screen.queryByText('Choose action')).toBeNull());
  expect(onClose).toHaveBeenCalledTimes(1);
  await user.press(screen.getByText('Open sheet'));
  expect(await screen.findByText('Choose action')).toBeOnTheScreen();
});
