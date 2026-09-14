'use client';

import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import {
  createDateTimePicker,
  DateTimePickerProvider,
  useDateTimePicker,
} from '@gluestack-ui/core/date-time-picker/creator';
import { UIIcon } from '@gluestack-ui/core/icon/creator';
import {
  useStyleContext,
  withStyleContext,
} from '@gluestack-ui/utils/nativewind-utils';
import DateTimePickerNative from '@react-native-community/datetimepicker';
import React, { useCallback, useMemo } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { withUniwind } from 'uniwind';
import {
  dateTimePickerIconStyle,
  dateTimePickerInputStyle,
  dateTimePickerStyle,
  dateTimePickerTriggerStyle,
} from './styles';

const SCOPE = 'DATE_TIME_PICKER';

export type DateTimePickerMode = 'date' | 'time' | 'datetime';

export type DateTimePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  mode?: DateTimePickerMode;
  minimumDate?: Date;
  maximumDate?: Date;
  locale?: string;
  timeZoneOffsetInMinutes?: number;
  is24Hour?: boolean;
  disabled?: boolean;
  placeholder?: string;
  format?: string;
  display?: 'modal' | 'inline'; // iOS only: 'modal' shows picker in modal with backdrop, 'inline' shows picker directly
  children?: React.ReactNode;
};

const DateTimePickerTriggerWrapper = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  React.ComponentProps<typeof Pressable>
>(({ ...props }, ref) => {
  return <Pressable {...props} ref={ref} />;
});

const StyledTextInput = withUniwind(TextInput);

const StyledUIIcon = withUniwind(UIIcon);

const UIDateTimePicker = createDateTimePicker({
  Root: withStyleContext(View, SCOPE),
  Trigger: withStyleContext(DateTimePickerTriggerWrapper, SCOPE),
  Input: StyledTextInput,
  Icon: StyledUIIcon,
});

type IDateTimePickerProps = VariantProps<typeof dateTimePickerStyle>
  & DateTimePickerProps & { className?: string };

const DateTimePicker = React.forwardRef<
  React.ComponentRef<typeof UIDateTimePicker>,
  IDateTimePickerProps
>((
  {
    className,
    value,
    onChange,
    mode = 'datetime',
    minimumDate,
    maximumDate,
    locale,
    timeZoneOffsetInMinutes,
    is24Hour,
    disabled,
    placeholder,
    format,
    display = 'modal', // Default to modal for iOS
    children,
    ...props
  },
  ref,
) => {
  const [defaultValue] = React.useState(() => new Date());
  const resolvedValue = value ?? defaultValue;

  const handleNativeChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (event.type === 'set' && selectedDate) {
        onChange?.(selectedDate);
      }
    },
    [onChange],
  );

  // On iOS, use custom trigger + spinner in modal or inline
  if (Platform.OS === 'ios') {
    return (
      <DateTimePickerProvider
        value={resolvedValue}
        onChange={onChange}
        mode={mode}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        locale={locale}
        timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
        is24Hour={is24Hour}
        disabled={disabled}
        placeholder={placeholder}
        format={format}
      >
        <UIDateTimePicker
          className={dateTimePickerStyle({ class: className })}
          ref={ref}
          {...props}
        >
          {children}
        </UIDateTimePicker>
        {/* iOS spinner picker shown in modal or inline based on display prop */}
        <IOSDateTimePicker
          value={resolvedValue}
          mode={mode}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          locale={locale}
          timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
          is24Hour={is24Hour}
          display={display}
          onConfirm={date => onChange?.(date)}
        />
      </DateTimePickerProvider>
    );
  }

  return (
    <DateTimePickerProvider
      value={resolvedValue}
      onChange={onChange}
      mode={mode}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
      locale={locale}
      timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
      is24Hour={is24Hour}
      disabled={disabled}
      placeholder={placeholder}
      format={format}
    >
      <UIDateTimePicker
        className={dateTimePickerStyle({ class: className })}
        ref={ref}
        {...props}
      >
        {children}
      </UIDateTimePicker>
      {/* Native picker is rendered directly on Android */}
      <DateTimePickerNativeWrapper
        value={resolvedValue}
        mode={mode}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
        is24Hour={is24Hour}
        onChange={handleNativeChange}
      />
    </DateTimePickerProvider>
  );
});

// Separate component to handle the native picker display (Android only)
function DateTimePickerNativeWrapper({
  value,
  mode,
  minimumDate,
  maximumDate,
  timeZoneOffsetInMinutes,
  is24Hour,
  onChange,
}: {
  value: Date;
  mode: DateTimePickerMode;
  minimumDate?: Date;
  maximumDate?: Date;
  timeZoneOffsetInMinutes?: number;
  is24Hour?: boolean;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
}) {
  const { isOpen, setIsOpen } = useDateTimePicker();

  const handleChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      setIsOpen(false);
      onChange(event, selectedDate);
    },
    [onChange, setIsOpen],
  );

  // Android doesn't support 'datetime' mode - use two-step picker
  if (mode === 'datetime') {
    return (
      <AndroidDateTimePicker
        value={value}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        is24Hour={is24Hour}
        isOpen={isOpen}
        onChange={onChange}
        setIsOpen={setIsOpen}
      />
    );
  }

  // Android: Use display="default" which opens system dialogs for date/time
  if (!isOpen)
    return null;

  return (
    <DateTimePickerNative
      key={`picker-${mode}`}
      value={value}
      mode={mode}
      display="default"
      minimumDate={minimumDate}
      maximumDate={maximumDate}
      timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
      is24Hour={is24Hour}
      onChange={handleChange}
    />
  );
}

// Android-specific datetime picker (uses two separate pickers)
function AndroidDateTimePicker({
  value,
  minimumDate,
  maximumDate,
  is24Hour,
  isOpen,
  onChange,
  setIsOpen,
}: {
  value: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  is24Hour?: boolean;
  isOpen: boolean;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
  setIsOpen: (open: boolean) => void;
}) {
  const [step, setStep] = React.useState<'date' | 'time'>('date');
  const [tempDate, setTempDate] = React.useState(value);

  const handleDateChange = React.useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (event.type === 'set' && selectedDate) {
        setTempDate(selectedDate);
        setStep('time');
      }
      else {
        setStep('date');
        setIsOpen(false);
      }
    },
    [setIsOpen],
  );

  const handleTimeChange = React.useCallback(
    (event: DateTimePickerEvent, selectedTime?: Date) => {
      setIsOpen(false);
      setStep('date');
      if (selectedTime && tempDate) {
        // Combine date and time
        const combinedDate = new Date(tempDate);
        combinedDate.setHours(selectedTime.getHours());
        combinedDate.setMinutes(selectedTime.getMinutes());
        onChange(event, combinedDate);
      }
      else if (selectedTime) {
        onChange(event, selectedTime);
      }
    },
    [tempDate, onChange, setIsOpen],
  );

  if (!isOpen)
    return null;

  if (step === 'date') {
    return (
      <DateTimePickerNative
        key="android-date"
        value={value}
        mode="date"
        display="default"
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onChange={handleDateChange}
      />
    );
  }

  return (
    <DateTimePickerNative
      key="android-time"
      value={tempDate}
      mode="time"
      display="default"
      is24Hour={is24Hour}
      onChange={handleTimeChange}
    />
  );
}

// iOS-specific picker with spinner in modal or inline
function IOSDateTimePicker({
  value,
  mode,
  minimumDate,
  maximumDate,
  locale,
  timeZoneOffsetInMinutes,
  is24Hour,
  display,
  onConfirm,
}: {
  value: Date;
  mode: DateTimePickerMode;
  minimumDate?: Date;
  maximumDate?: Date;
  locale?: string;
  timeZoneOffsetInMinutes?: number;
  is24Hour?: boolean;
  display: 'modal' | 'inline';
  onConfirm: (date: Date) => void;
}) {
  const { isOpen, setIsOpen } = useDateTimePicker();
  const [tempValue, setTempValue] = React.useState(value);

  // Update temp value when picker opens
  React.useEffect(() => {
    if (isOpen) {
      // Reset the modal draft whenever a new picker session begins.
      // eslint-disable-next-line react/set-state-in-effect
      setTempValue(value);
    }
  }, [isOpen, value]);

  const handleChange = React.useCallback(
    (_event: DateTimePickerEvent, selectedDate?: Date) => {
      if (selectedDate) {
        setTempValue(selectedDate);
      }
    },
    [],
  );

  const handleDone = React.useCallback(() => {
    onConfirm(tempValue);
    setIsOpen(false);
  }, [onConfirm, setIsOpen, tempValue]);

  const handleCancel = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  if (!isOpen)
    return null;

  const picker = (
    <DateTimePickerNative
      testID="date-time-picker-native"
      value={tempValue}
      mode={mode}
      display="spinner"
      minimumDate={minimumDate}
      maximumDate={maximumDate}
      locale={locale}
      timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
      is24Hour={is24Hour}
      onChange={handleChange}
    />
  );

  if (display === 'inline') {
    return (
      <View className="w-full rounded-lg border border-border bg-background p-4">
        <IOSPickerHeader
          mode={mode}
          onCancel={handleCancel}
          onDone={handleDone}
        />
        {picker}
      </View>
    );
  }

  // Modal mode: show picker in modal with backdrop
  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View className="flex-1 justify-end">
        {/* Backdrop - separate touchable area */}
        <Pressable
          className="absolute inset-0 bg-black/50"
          onPress={handleCancel}
        />
        {/* Picker container */}
        <View className="relative rounded-t-lg bg-background p-4">
          <IOSPickerHeader
            mode={mode}
            onCancel={handleCancel}
            onDone={handleDone}
          />
          {picker}
        </View>
      </View>
    </Modal>
  );
}

function IOSPickerHeader({
  mode,
  onCancel,
  onDone,
}: {
  mode: DateTimePickerMode;
  onCancel: () => void;
  onDone: () => void;
}) {
  return (
    <View className="mb-4 flex-row items-center justify-between border-b border-border pb-2">
      <Pressable accessibilityRole="button" onPress={onCancel}>
        <Text className="text-base font-semibold text-primary">Cancel</Text>
      </Pressable>
      <Text className="text-base font-semibold text-foreground">
        {mode === 'date'
          ? 'Select Date'
          : mode === 'time'
            ? 'Select Time'
            : 'Select Date & Time'}
      </Text>
      <Pressable accessibilityRole="button" onPress={onDone}>
        <Text className="text-base font-semibold text-primary">Done</Text>
      </Pressable>
    </View>
  );
}

type IDateTimePickerTriggerProps = VariantProps<
  typeof dateTimePickerTriggerStyle
>
& React.ComponentProps<typeof UIDateTimePicker.Trigger> & {
  className?: string;
};

const DateTimePickerTrigger = React.forwardRef<
  React.ComponentRef<typeof UIDateTimePicker.Trigger>,
  IDateTimePickerTriggerProps
>((
  {
    className,
    size = 'md',
    variant = 'outline',
    onPress: userOnPress,
    ...props
  },
  ref,
) => {
  const { disabled, setIsOpen } = useDateTimePicker();

  return (
    <UIDateTimePicker.Trigger
      className={dateTimePickerTriggerStyle({
        class: className,
        size,
        variant,
      })}
      ref={ref}
      context={{ size, variant }}
      disabled={disabled}
      {...props}
      onPress={(event) => {
        if (!disabled) {
          setIsOpen(true);
        }
        userOnPress?.(event);
      }}
    />
  );
});

type IDateTimePickerInputProps = VariantProps<typeof dateTimePickerInputStyle>
  & React.ComponentProps<typeof UIDateTimePicker.Input> & { className?: string };

const DateTimePickerInput = React.forwardRef<
  React.ComponentRef<typeof UIDateTimePicker.Input>,
  IDateTimePickerInputProps
>(({ className, ...props }, ref) => {
  const { size: parentSize, variant: parentVariant } = useStyleContext(SCOPE);
  const { value, placeholder, format, locale, mode } = useDateTimePicker();

  const displayValue = useMemo(() => {
    if (!value)
      return '';
    if (format) {
      return formatDate(value, format);
    }
    return formatDisplayValue(value, mode, locale);
  }, [value, format, locale, mode]);

  return (
    <UIDateTimePicker.Input
      className={dateTimePickerInputStyle({
        class: className,
        parentVariants: {
          size: parentSize,
          variant: parentVariant,
        },
      })}
      ref={ref}
      value={displayValue}
      placeholder={placeholder}
      editable={false}
      style={{ pointerEvents: 'none' }}
      {...props}
    />
  );
});

type IDateTimePickerIconProps = VariantProps<typeof dateTimePickerIconStyle>
  & React.ComponentProps<typeof UIDateTimePicker.Icon> & {
    className?: string;
    height?: number;
    width?: number;
  };

const DateTimePickerIcon = React.forwardRef<
  React.ComponentRef<typeof UIDateTimePicker.Icon>,
  IDateTimePickerIconProps
>(({ className, size, ...props }, ref) => {
  const { size: parentSize } = useStyleContext(SCOPE);

  if (typeof size === 'number') {
    return (
      <UIDateTimePicker.Icon
        ref={ref as never}
        {...props}
        className={dateTimePickerIconStyle({ class: className })}
        size={size}
      />
    );
  }

  return (
    <UIDateTimePicker.Icon
      className={dateTimePickerIconStyle({
        class: className,
        size,
        parentVariants: {
          size: parentSize,
        },
      })}
      ref={ref as never}
      {...props}
    />
  );
});

function formatDate(date: Date, format: string): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return format
    .replace('YYYY', date.getFullYear().toString())
    .replace('MM', pad(date.getMonth() + 1))
    .replace('DD', pad(date.getDate()))
    .replace('HH', pad(date.getHours()))
    .replace('mm', pad(date.getMinutes()))
    .replace('ss', pad(date.getSeconds()));
}

function formatDisplayValue(
  date: Date,
  mode: DateTimePickerMode,
  locale?: string,
): string {
  if (mode === 'date') {
    return date.toLocaleDateString(locale);
  }
  if (mode === 'time') {
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return date.toLocaleString(locale);
}

export {
  DateTimePicker,
  DateTimePickerIcon,
  DateTimePickerInput,
  DateTimePickerTrigger,
};
