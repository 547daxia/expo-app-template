import { Text } from 'react-native';

import {
  CalendarBody,
  CalendarGrid,
  CalendarHeader,
  CalendarHeaderNextButton,
  CalendarHeaderPrevButton,
  CalendarHeaderTitle,
  CalendarWeekDaysHeader,
} from '@/components/ui/calendar';

/** Standard month navigation and day grid inside a generated Calendar root. */
export function CalendarContent() {
  return (
    <>
      <CalendarHeader>
        <CalendarHeaderPrevButton accessibilityLabel="Previous month"><Text>‹</Text></CalendarHeaderPrevButton>
        <CalendarHeaderTitle />
        <CalendarHeaderNextButton accessibilityLabel="Next month"><Text>›</Text></CalendarHeaderNextButton>
      </CalendarHeader>
      <CalendarWeekDaysHeader />
      <CalendarBody><CalendarGrid /></CalendarBody>
    </>
  );
}
