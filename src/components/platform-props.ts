export const selectableTextProps = { selectable: true } as const;

export function textTestIdProps(testID: string) {
  return { testID } as const;
}

export function textLineLimitProps(numberOfLines: number) {
  return { numberOfLines } as const;
}
