'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTheme } from 'next-themes';

export default function DateRangePicker({
  className,
  buttonClassName,
  iconPosition = 'left',
  dateMode = 'range',
  defaultMonth,
  date,
  setDate,
  disabled,
  placeHolder,
  dateFormat = 'LLL dd, y'
}: {
  className?: string;
  buttonClassName?: string;
  iconPosition?: 'left' | 'right';
  dateMode?: 'default' | 'range' | 'multiple' | 'single' | undefined;
  defaultMonth?: Date;
  date: any;
  placeHolder?: string;
  setDate: (date: any) => void;
  disabled?: boolean;
  dateFormat?: string;
}) {
  const { theme: mode } = useTheme();

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              'font-normal',
              {
                'bg-background text-default-600 hover:bg-background hover:ring-background': mode !== 'dark'
              },
              buttonClassName
            )}
          >
            {iconPosition === 'left' && <CalendarIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />}
            {date ? (
              dateMode === 'range' ? (
                date.from ? (
                  date.to ? (
                    <>
                      {format(date.from, dateFormat)} - {format(date.to, dateFormat)}
                    </>
                  ) : (
                    format(date.from, dateFormat)
                  )
                ) : (
                  <span>{placeHolder || 'Pick a date'}</span>
                )
              ) : (
                format(date, dateFormat)
              )
            ) : (
              <span>{placeHolder || `Pick a date`}</span>
            )}

            {iconPosition === 'right' && <CalendarIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            disabled={disabled}
            initialFocus
            mode={dateMode}
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
