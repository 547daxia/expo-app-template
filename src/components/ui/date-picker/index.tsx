import type { ComponentProps } from 'react';

import {
  DateTimePicker,
  DateTimePickerIcon,
  DateTimePickerInput,
  DateTimePickerTrigger,
} from '@/components/ui/date-time-picker';
import { CalendarDaysIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';

export type DatePickerProps = {
  value: Date;
  onChange?: (date: Date) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  testID?: string;
  accessibilityLabel?: string;
} & Pick<ComponentProps<typeof View>, 'className'>;

export function DatePicker({
  value,
  onChange,
  label,
  error,
  disabled = false,
  minimumDate,
  maximumDate,
  testID,
  accessibilityLabel,
  className,
}: DatePickerProps) {
  return (
    <View className={`gap-1.5 ${className ?? ''}`}>
      {label && (
        <Text testID={testID ? `${testID}-label` : undefined} size="sm">
          {label}
        </Text>
      )}

      <DateTimePicker
        value={value}
        mode="date"
        disabled={disabled}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onChange={(date) => {
          if (date) {
            onChange?.(date);
          }
        }}
      >
        <DateTimePickerTrigger
          testID={testID ? `${testID}-trigger` : undefined}
          accessibilityLabel={accessibilityLabel ?? label ?? 'Choose date'}
          accessibilityState={{ disabled }}
        >
          <DateTimePickerInput
            testID={testID ? `${testID}-input` : undefined}
          />
          <DateTimePickerIcon as={CalendarDaysIcon} className="mr-3" />
        </DateTimePickerTrigger>
      </DateTimePicker>

      {error && (
        <Text
          testID={testID ? `${testID}-error` : undefined}
          className="text-destructive"
          size="sm"
        >
          {error}
        </Text>
      )}
    </View>
  );
}
