import {
  selectableTextProps,
  textLineLimitProps,
  textTestIdProps,
} from './platform-props';

describe('native platform props', () => {
  it('preserves React Native text selection and test IDs', () => {
    expect(selectableTextProps).toEqual({ selectable: true });
    expect(textTestIdProps('stable-id')).toEqual({ testID: 'stable-id' });
    expect(textLineLimitProps(3)).toEqual({ numberOfLines: 3 });
  });
});
