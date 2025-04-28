'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function DateRangePicker({
  className,
  onChange
}: React.HTMLAttributes<HTMLDivElement> & {
  onChange: (date: DateRange | undefined) => void;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    if (onChange) {
      onChange(selectedDate);
    }

    // Close the Popover when the end date (`date.to`) is selected
    if (selectedDate?.to) {
      setOpen(false);
    }
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="default"
            className={cn(
              'w-full min-w-[270px] justify-between text-left text-xs font-normal sm:text-sm',
              date?.from ? 'text-primary' : 'text-[#4B4B4B]'
            )}
            size="md"
            onClick={() => setOpen((prev) => !prev)} // Toggle Popover on button click
          >
            {date?.from ? (
              date.to ? (
                `${format(date.from, 'dd/MM/yyyy')} - ${format(date.to, 'dd/MM/yyyy')}`
              ) : (
                `${format(date.from, 'dd/MM/yyyy')} - DD/MM/YYYY`
              )
            ) : (
              <span>DD/MM/YYYY - DD/MM/YYYY</span>
            )}
            <CalendarIcon className="ml-2 mr-2 h-4 w-4 sm:mr-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2 md:p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={1}
            className="rounded-md border-0"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
