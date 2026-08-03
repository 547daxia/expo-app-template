import React from 'react';

import { Button, ButtonText } from '@/components/ui/button';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import {
  DateTimePicker,
  DateTimePickerIcon,
  DateTimePickerInput,
  DateTimePickerTrigger,
} from '@/components/ui/date-time-picker';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelAstrick,
  FormControlLabelText,
} from '@/components/ui/form-control';
import {
  AlertCircleIcon,
  CalendarDaysIcon,
  CheckIcon,
  ChevronDownIcon,
  CircleIcon,
  MailIcon,
} from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { InputAccessoryView } from '@/components/ui/input-accessory-view';
import { KeyboardAvoidingView } from '@/components/ui/keyboard-avoiding-view';
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from '@/components/ui/radio';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '@/components/ui/select';
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { DemoLabel, DemoRow, DemoSection } from './catalog-layout';

const initialDate = new Date(2026, 7, 3, 9, 30);

export function FormsDemo() {
  return (
    <DemoSection
      eyebrow="Inputs"
      title="Forms and controls"
      description="Controlled examples for input, selection, validation, date, time and keyboard-aware primitives."
    >
      <KeyboardAvoidingView
        behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}
      >
        <VStack className="gap-5">
          <TextFieldsDemo />
          <SelectionDemo />
          <DateAndRangeDemo />
        </VStack>
      </KeyboardAvoidingView>
    </DemoSection>
  );
}

function TextFieldsDemo() {
  return (
    <VStack className="gap-3">
      <DemoLabel>Input, textarea and form-control</DemoLabel>
      <FormControl isInvalid isRequired>
        <FormControlLabel>
          <FormControlLabelText>Email address</FormControlLabelText>
          <FormControlLabelAstrick />
        </FormControlLabel>
        <Input>
          <InputSlot>
            <InputIcon as={MailIcon} />
          </InputSlot>
          <InputField
            inputAccessoryViewID="style-demo-accessory"
            keyboardType="email-address"
            placeholder="hello@example.com"
          />
        </Input>
        <FormControlHelper>
          <FormControlHelperText>Used for account notifications.</FormControlHelperText>
        </FormControlHelper>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>Example validation message</FormControlErrorText>
        </FormControlError>
      </FormControl>
      <Textarea>
        <TextareaInput placeholder="Write a short note…" />
      </Textarea>
      {process.env.EXPO_OS === 'ios' && (
        <InputAccessoryView nativeID="style-demo-accessory">
          <Button className="m-2 self-end" size="sm">
            <ButtonText>Done</ButtonText>
          </Button>
        </InputAccessoryView>
      )}
    </VStack>
  );
}

function SelectionDemo() {
  const [checked, setChecked] = React.useState(true);
  const [radio, setRadio] = React.useState('comfortable');
  const [selected, setSelected] = React.useState('react-native');
  const [enabled, setEnabled] = React.useState(true);

  return (
    <VStack className="gap-3">
      <DemoLabel>Checkbox, radio, select and switch</DemoLabel>
      <Checkbox value="updates" isChecked={checked} onChange={setChecked}>
        <CheckboxIndicator>
          <CheckboxIcon as={CheckIcon} />
        </CheckboxIndicator>
        <CheckboxLabel>Product updates</CheckboxLabel>
      </Checkbox>
      <RadioGroup value={radio} onChange={setRadio} className="flex-row gap-4">
        <Radio value="compact">
          <RadioIndicator><RadioIcon as={CircleIcon} /></RadioIndicator>
          <RadioLabel>Compact</RadioLabel>
        </Radio>
        <Radio value="comfortable">
          <RadioIndicator><RadioIcon as={CircleIcon} /></RadioIndicator>
          <RadioLabel>Comfortable</RadioLabel>
        </Radio>
      </RadioGroup>
      <Select selectedValue={selected} onValueChange={setSelected}>
        <SelectTrigger>
          <SelectInput placeholder="Choose a platform" />
          <SelectIcon as={ChevronDownIcon} className="mr-3" />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            <SelectItem label="React Native" value="react-native" />
            <SelectItem label="Web" value="web" />
            <SelectItem label="Native iOS" value="ios" />
          </SelectContent>
        </SelectPortal>
      </Select>
      <DemoRow>
        <Switch value={enabled} onValueChange={setEnabled} />
        <Text selectable>
          Notifications
          {enabled ? 'on' : 'off'}
        </Text>
      </DemoRow>
    </VStack>
  );
}

function DateAndRangeDemo() {
  const [date, setDate] = React.useState(initialDate);
  const [time, setTime] = React.useState(initialDate);
  const [slider, setSlider] = React.useState(64);

  return (
    <VStack className="gap-3">
      <DemoLabel>Date picker, date-time picker and slider</DemoLabel>
      <DatePicker label="Release date" value={date} onChange={setDate} />
      <DateTimePicker value={time} mode="time" format="HH:mm" onChange={value => value && setTime(value)}>
        <DateTimePickerTrigger>
          <DateTimePickerInput placeholder="Choose time" />
          <DateTimePickerIcon as={CalendarDaysIcon} className="mr-3" />
        </DateTimePickerTrigger>
      </DateTimePicker>
      <DemoRow>
        <Text selectable className="w-12 text-sm" style={{ fontVariant: ['tabular-nums'] }}>
          {slider}
          %
        </Text>
        <Slider className="min-w-52 flex-1" value={slider} onChange={setSlider}>
          <SliderTrack><SliderFilledTrack /></SliderTrack>
          <SliderThumb />
        </Slider>
      </DemoRow>
    </VStack>
  );
}
