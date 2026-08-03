import React from 'react';
import { Platform, Pressable, Text } from 'react-native';

import { cleanup, fireEvent, render, screen } from '@/lib/test-utils';
import {
  DateTimePicker,
  DateTimePickerInput,
  DateTimePickerTrigger,
} from './index';

jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => React.createElement(View, props),
  };
});

afterEach(cleanup);

describe('date time picker', () => {
  it('keeps iOS changes as a draft until Done is pressed', () => {
    jest.replaceProperty(Platform, 'OS', 'ios');
    const initialValue = new Date(2026, 7, 3, 9, 0);
    const nextValue = new Date(2026, 7, 8, 14, 30);
    const onChange = jest.fn();

    render(
      <DateTimePicker value={initialValue} mode="date" onChange={onChange}>
        <DateTimePickerTrigger testID="date-trigger">
          <DateTimePickerInput />
        </DateTimePickerTrigger>
      </DateTimePicker>,
    );

    fireEvent.press(screen.getByTestId('date-trigger'));
    fireEvent(
      screen.getByTestId('date-time-picker-native'),
      'onChange',
      { type: 'set' },
      nextValue,
    );
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.press(screen.getByText('Cancel'));
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.press(screen.getByTestId('date-trigger'));
    fireEvent(
      screen.getByTestId('date-time-picker-native'),
      'onChange',
      { type: 'set' },
      nextValue,
    );
    fireEvent.press(screen.getByText('Done'));

    expect(onChange).toHaveBeenCalledWith(nextValue);
  });

  it('preserves a caller trigger handler while opening the picker', () => {
    jest.replaceProperty(Platform, 'OS', 'ios');
    const onPress = jest.fn();

    render(
      <DateTimePicker value={new Date()} mode="date">
        <DateTimePickerTrigger testID="date-trigger" onPress={onPress}>
          <Pressable><Text>Open</Text></Pressable>
        </DateTimePickerTrigger>
      </DateTimePicker>,
    );

    fireEvent.press(screen.getByTestId('date-trigger'));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Select Date')).toBeOnTheScreen();
  });
});
