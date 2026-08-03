/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { TextProps } from 'react-native';
import * as React from 'react';
import { Text as NNText } from 'react-native';

import { twMerge } from 'tailwind-merge';

type Props = {
  className?: string;
} & TextProps;

export function Text({
  className = '',
  style,
  children,
  ...props
}: Props) {
  const textStyle = React.useMemo(
    () =>
      twMerge(
        'font-inter text-base font-normal text-black dark:text-white',
        className,
      ),
    [className],
  );

  return (
    <NNText className={textStyle} style={style} {...props}>
      {children}
    </NNText>
  );
}
