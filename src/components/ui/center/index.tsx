import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import type { ViewProps } from 'react-native';
import React from 'react';
import { View } from 'react-native';
import { centerStyle } from './styles';

type ICenterProps = ViewProps & VariantProps<typeof centerStyle>;

const Center = React.forwardRef<React.ComponentRef<typeof View>, ICenterProps>(
  ({ className, ...props }, ref) => {
    return (
      <View
        className={centerStyle({ class: className })}
        {...props}
        ref={ref}
      />
    );
  },
);

Center.displayName = 'Center';

export { Center };
