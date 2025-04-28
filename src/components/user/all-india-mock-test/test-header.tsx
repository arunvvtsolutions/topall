import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import SearchInput from '@/components/common/search-input';
import { Calendar } from '@/components/ui/calendar'; // Ensure this import matches your setup
import { isSameDay } from 'date-fns';
import { ButtonNames } from '@/types/enum';

interface IExamHeader {
  onRefresh: () => void;
  onSearchChange: (value: string) => void;
  searchValue: string;
  startDates: any[];
  showCalendar: boolean;
  setShowCalendar: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

const TestHeader = ({
  onRefresh,
  searchValue,
  onSearchChange,
  startDates,
  showCalendar,
  setShowCalendar,
  selectedDate,
  onDateSelect
}: IExamHeader) => {
  // Transform startDates into Date objects
  const highlightedDates = useMemo(
    () =>
      startDates
        .map((date) => {
          const parsedDate = new Date(date.startDate);
          return isNaN(parsedDate.getTime()) ? null : parsedDate;
        })
        .filter((date): date is Date => date !== null),
    [startDates]
  );

  // Modifier for current and exam dates
  const modifiers = useMemo(
    () => ({
      highlighted: highlightedDates,
      current: (date: Date) => isSameDay(date, new Date())
    }),
    [highlightedDates]
  );

  // Modifier styles
  const modifiersStyles = {
    highlighted: {
      backgroundColor: 'green',
      color: 'white'
    },
    current: {
      backgroundColor: 'blue',
      color: 'white'
    }
  };

  const toggleCalendar = () => {
    setShowCalendar((prev) => !prev);
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateSelect(date);
    } else {
      setShowCalendar(false);
      return;
    }
  };

  return (
    <div className="flex flex-col justify-between gap-y-2 md:flex-row md:gap-y-0">
      <div className="mt-3 flex flex-1 items-center justify-between md:flex-none">
        <h1 className="text-lg font-medium text-B2CAgrayn sm:text-xl md:text-2xl">All India Mock - Test</h1>
        <div className="md:item-center flex gap-x-2 md:hidden">
          <Button size="icon" variant="outline" color="success" onClick={onRefresh} className="h-9 w-9" data-testid="refresh-btn">
            <Icon icon="nrk:refresh" className="mx-1" fontSize={20} />
          </Button>
          <div className="relative">
            <Button
              size="icon"
              variant="outline"
              color="primary"
              className="h-9 w-9"
              onClick={toggleCalendar}
              data-testid="calendar-btn"
            >
              <Icon icon="solar:calendar-linear" className="mx-1" fontSize={20} />
            </Button>
            {showCalendar && (
              <div
                className="absolute top-full z-10 mt-2 max-h-[400px] max-w-[300px] overflow-auto rounded-md bg-white p-2 shadow-lg"
                style={{ right: 0, left: 'auto' }}
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 sm:flex sm:items-center sm:gap-4 sm:space-y-0 md:justify-end">
        <div className="w-full md:w-[300px]">
          <SearchInput
            placeholder="Search by Test Name"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="text-base font-normal text-B2CAgrayn"
          />
        </div>
        <div className="md:item-center relative hidden md:flex md:gap-x-2">
          <Button
            size="md"
            variant="outline"
            color="success"
            className="w-full rounded-lg !px-2 text-base font-normal sm:w-auto"
            onClick={onRefresh}
            data-testid="refresh-btn "
          >
            <Icon icon="nrk:refresh" className="mr-1 font-semibold" fontSize={18} />
            {ButtonNames.REFRESH}
          </Button>
          <div>
            <Button
              size="md"
              variant="outline"
              color="primary"
              className="w-full rounded-lg border-primary !px-2 text-base font-normal hover:border-primary sm:w-auto"
              onClick={toggleCalendar}
              data-testid="calendar-btn"
            >
              <Icon icon="solar:calendar-linear" className="mr-1" fontSize={18} />
              {ButtonNames.CALENDAR}
            </Button>
            {showCalendar && (
              <div
                className="absolute top-full z-10 mt-2 max-h-[400px] max-w-[300px] overflow-auto rounded-md bg-white p-2 shadow-lg"
                style={{ right: 0, left: 'auto' }}
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestHeader;
