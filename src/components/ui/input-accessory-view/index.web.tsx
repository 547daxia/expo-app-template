'use client';

import type { ComponentProps } from 'react';

import React from 'react';
import { View } from 'react-native';

type InputAccessoryViewProps = ComponentProps<typeof View>;

const InputAccessoryView = React.forwardRef<
  React.ComponentRef<typeof View>,
  InputAccessoryViewProps
>((props, ref) => <View ref={ref} {...props} />);

InputAccessoryView.displayName = 'InputAccessoryView';

export { InputAccessoryView };
