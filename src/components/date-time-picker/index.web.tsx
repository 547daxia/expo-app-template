'use client';

import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';

import {
  createDateTimePicker,
  DateTimePickerProvider,
  useDateTimePicker,
} from '@gluestack-ui/core/date-time-picker/creator';
import { UIIcon } from '@gluestack-ui/core/icon/creator';
import { Overlay } from '@gluestack-ui/core/overlay/creator';
import { FocusScope } from '@gluestack-ui/utils/aria';
import {
  useStyleContext,
  withStyleContext,
} from '@gluestack-ui/utils/nativewind-utils';
import React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { withUniwind } from 'uniwind';

import { CalendarContent } from '@/components/calendar-content';
import { Calendar } from '@/components/ui/calendar';
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
  display?: 'modal' | 'inline';
  children?: React.ReactNode;
};

const DateTimePickerTriggerWrapper = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  React.ComponentProps<typeof Pressable>
>((props, ref) => <Pressable ref={ref} {...props} />);

const StyledUIIcon = withUniwind(UIIcon);

// Preserve the input ref type without adding a styling wrapper.
const BaseTextInput: React.ComponentType<React.ComponentPropsWithRef<typeof TextInput>> = TextInput;

const UIDateTimePicker = createDateTimePicker({
  Root: withStyleContext(View, SCOPE),
  Trigger: withStyleContext(DateTimePickerTriggerWrapper, SCOPE),
  Input: BaseTextInput,
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
    children,
    ...props
  },
  ref,
) => {
  return (
    <DateTimePickerProvider
      value={value}
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
        ref={ref}
        className={dateTimePickerStyle({ class: `relative ${className ?? ''}` })}
        {...props}
      >
        {children}
        <WebDateTimePickerPopover />
      </UIDateTimePicker>
    </DateTimePickerProvider>
  );
});

function WebDateTimePickerPopover() {
  const {
    isOpen,
    setIsOpen,
    value,
    onChange,
    mode,
    minimumDate,
    maximumDate,
  } = useDateTimePicker();
  const [draftDate, setDraftDate] = React.useState<Date | undefined>(value);
  const [draftTime, setDraftTime] = React.useState(() =>
    value ? formatTimeForInput(value) : '',
  );

  React.useEffect(() => {
    if (isOpen) {
      // Each open starts a new transaction from the current controlled value.
      // eslint-disable-next-line react/set-state-in-effect
      setDraftDate(value);
      // eslint-disable-next-line react/set-state-in-effect
      setDraftTime(value ? formatTimeForInput(value) : '');
    }
  }, [isOpen, value]);

  const handleConfirm = React.useCallback(() => {
    let nextValue = draftDate;

    if (mode === 'time') {
      nextValue = value ? new Date(value) : new Date();
    }

    if (nextValue && (mode === 'time' || mode === 'datetime') && draftTime) {
      const [hours, minutes] = draftTime.split(':').map(Number);
      nextValue = new Date(nextValue);
      nextValue.setHours(hours, minutes, 0, 0);
    }

    if (nextValue) {
      onChange?.(nextValue);
    }
    setIsOpen(false);
  }, [draftDate, draftTime, mode, onChange, setIsOpen, value]);

  if (!isOpen) {
    return null;
  }

  return (
    <Overlay isOpen isKeyboardDismissable onRequestClose={() => setIsOpen(false)}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'grid', placeItems: 'center', padding: 16 }}>
        <button
          type="button"
          aria-label="Close date picker"
          onClick={() => setIsOpen(false)}
          style={{ position: 'absolute', inset: 0, border: 0, background: 'rgba(0, 0, 0, 0.45)' }}
        />
        <FocusScope contain autoFocus restoreFocus>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Choose date and time"
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.stopPropagation();
                setIsOpen(false);
              }
            }}
            style={{ position: 'relative', width: 'min(100%, 24rem)', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <View className="gap-4 rounded-lg border border-border bg-background p-4 shadow-lg">
              {(mode === 'date' || mode === 'datetime') && (
                <Calendar
                  mode="single"
                  value={draftDate}
                  onValueChange={setDraftDate}
                  minDate={minimumDate}
                  maxDate={maximumDate}
                  initialMonth={draftDate}
                >
                  <CalendarContent />
                </Calendar>
              )}

              {(mode === 'time' || mode === 'datetime') && (
                <input
                  aria-label="Time"
                  className="w-full rounded-sm border border-border bg-background p-2 text-sm text-foreground"
                  type="time"
                  value={draftTime}
                  onChange={event => setDraftTime(event.target.value)}
                />
              )}

              <View className="flex-row justify-end gap-2">
                <button
                  type="button"
                  className="rounded-sm bg-muted px-4 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-sm text-muted-foreground">Cancel</span>
                </button>
                <button
                  type="button"
                  className="rounded-sm bg-primary px-4 py-2"
                  onClick={handleConfirm}
                >
                  <span className="text-sm text-primary-foreground">Confirm</span>
                </button>
              </View>
            </View>
          </div>
        </FocusScope>
      </div>
    </Overlay>
  );
}

type IDateTimePickerTriggerProps = VariantProps<typeof dateTimePickerTriggerStyle>
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
      ref={ref}
      className={dateTimePickerTriggerStyle({ class: className, size, variant })}
      context={{ size, variant }}
      disabled={disabled}
      accessibilityRole="button"
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

  const displayValue = React.useMemo(() => {
    if (!value) {
      return '';
    }
    if (format) {
      return formatDate(value, format);
    }
    return formatDisplayValue(value, mode, locale);
  }, [format, locale, mode, value]);

  return (
    <UIDateTimePicker.Input
      ref={ref}
      className={dateTimePickerInputStyle({
        class: className,
        parentVariants: { size: parentSize, variant: parentVariant },
      })}
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

  return (
    <UIDateTimePicker.Icon
      ref={ref as never}
      className={dateTimePickerIconStyle({
        class: className,
        size: typeof size === 'number' ? undefined : size,
        parentVariants: { size: parentSize },
      })}
      size={size}
      {...props}
    />
  );
});

function formatDate(date: Date, format: string): string {
  const pad = (value: number) => value.toString().padStart(2, '0');
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

function formatTimeForInput(date: Date): string {
  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

export {
  DateTimePicker,
  DateTimePickerIcon,
  DateTimePickerInput,
  DateTimePickerTrigger,
};
