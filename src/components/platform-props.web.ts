export const selectableTextProps = {} as const;

export function textTestIdProps(testID: string) {
  return { 'data-testid': testID } as const;
}

export function textLineLimitProps(numberOfLines: number) {
  return {
    style: {
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: numberOfLines,
      display: '-webkit-box',
      overflow: 'hidden',
    },
  } as const;
}
