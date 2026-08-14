import {
  selectableTextProps,
  textLineLimitProps,
  textTestIdProps,
} from './platform-props.web';

describe('web platform props', () => {
  it('maps test IDs to DOM attributes without leaking native-only props', () => {
    expect(selectableTextProps).toEqual({});
    expect(textTestIdProps('stable-id')).toEqual({ 'data-testid': 'stable-id' });
    expect(textLineLimitProps(3)).toEqual({
      style: {
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 3,
        display: '-webkit-box',
        overflow: 'hidden',
      },
    });
  });
});
