'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, disabled, ...props }: CalendarProps) {
  return (
    <DayPicker
      disabled={disabled}
      showOutsideDays={showOutsideDays}
      className={cn('border-default-200 p-0 dark:border-default-300 md:p-3', className)}
      classNames={{
        months: 'w-full space-y-4 sm:gap-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center py-1 relative items-center',
        caption_label: 'text-base font-medium',
        nav: 'gap-x-1 flex items-center',

        // Fixing the navigation buttons to always be visible
        nav_button: cn(
          buttonVariants({ variant: 'outline', size: 'icon' }),
          'h-7 w-7 bg-transparent p-0 opacity-100 hover:opacity-100 focus:opacity-100', // Set opacity to 100 by default
          'text-black dark:text-white', // Set text color for visibility
          'hover:bg-gray-300 hover:border hover:border-gray-500'
        ),
        nav_button_previous: 'absolute start-2',
        nav_button_next: 'absolute end-2',

        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'flex-1 text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full gap-1 mt-2',
        cell: 'flex-1 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-default [&:has([aria-selected])]:rounded-md focus-within:relative focus-within:z-20',

        day: 'w-full h-9 rounded p-0 font-normal text-current hover:text-[#020817] hover:bg-gray-200 focus:text-white focus:bg-[#020817] aria-selected:bg-[#020817] aria-selected:text-white',

        // Persistent selected state styling (even if focus is lost)
        day_selected: 'bg-[#020817] text-white hover:bg-[#020817] hover:text-white focus:bg-[#020817] focus:text-white',

        // For today’s date, apply a unique style
        day_today: 'bg-accent text-accent-foreground',

        // For outside days (days not in the current month), style them differently
        day_outside: 'text-muted-foreground opacity-50',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-[#F1F5F9] aria-selected:text-[#000000] aria-selected:hover:bg-black aria-selected:hover:text-white',
        day_hidden: 'invisible',

        ...classNames
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />
      }}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };
