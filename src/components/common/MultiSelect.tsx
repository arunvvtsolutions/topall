'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Icon } from '../ui/icon';

const multiSelectVariants = cva('m-1 ', {
  variants: {
    variant: {
      default: 'border-foreground/10 text-foreground bg-card hover:bg-card/80 text-primary',
      secondary: 'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
      inverted: 'inverted'
    }
  },

  defaultVariants: {
    variant: 'default'
  }
});

const colors = {
  primary: '',
  secondary: 'text-B2Cgray'
};

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'defaultValue'>,
    VariantProps<typeof multiSelectVariants> {
  options: {
    id: number;
    name: string;
  }[];
  onValueChange: (value: number[]) => void;
  defaultValue?: number[];
  placeholder?: string;
  placeholderClassName?: string;
  animation?: number;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  className?: string;
  disabled?: boolean;
  dataTestId?: string;
  color?: keyof typeof colors;
  triggerId?:string
}

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = 'Select options',
      placeholderClassName = 'text-sm text-inherit',
      maxCount = options.length,
      modalPopover = true,
      className,
      disabled,
      dataTestId = 'multi-select',
      color = 'primary',
      triggerId = 'popover-trigger'
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<number[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    const toggleOption = (optionId: number) => {
      const newSelectedValues = selectedValues.includes(optionId)
        ? selectedValues.filter((value) => value !== optionId)
        : [...selectedValues, optionId];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedValues([]);
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        handleClear();
      } else {
        const allValues = options.map((option) => option.id);
        setSelectedValues(allValues);
        onValueChange(allValues);
      }
    };

    React.useEffect(() => {
      setSelectedValues(defaultValue);
    }, [defaultValue]);

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
        <PopoverTrigger asChild id={triggerId}>
          <Button
            ref={ref}
            onClick={handleTogglePopover}
            className={cn(
              'relative flex h-auto min-h-10 w-full items-center justify-between truncate rounded-md border bg-inherit !px-2 hover:bg-inherit [&_svg]:pointer-events-auto',
              className
            )}
            data-test-id={dataTestId}
            disabled={disabled}
          >
            {selectedValues.length > 0 ? (
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-wrap items-center">
                  {selectedValues.slice(0, maxCount).map((value) => {
                    const option = options.find((o) => o.id === value);

                    return (
                      <Badge key={value} className={cn(multiSelectVariants({ variant }))}>
                        {option?.name}
                      </Badge>
                    );
                  })}

                  {selectedValues.length > maxCount && (
                    <Badge
                      className={cn(
                        'border-foreground/1 bg-transparent text-foreground hover:bg-transparent',
                        multiSelectVariants({ variant })
                      )}
                    >
                      {`+ ${selectedValues.length - maxCount}`}
                    </Badge>
                  )}
                </div>
                <div className={`flex items-center justify-between ${colors[color]}`}>
                  <Icon icon="ic:round-arrow-drop-up" className="text-[30px] text-inherit" />
                </div>
              </div>
            ) : (
              <div className={`mx-auto flex w-full items-center justify-between ${colors[color]}`}>
                <span className={cn(placeholderClassName)}>{placeholder}</span>
                <Icon icon="ic:round-arrow-drop-down" className="text-[30px] text-inherit" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          style={{ minWidth: `${document.getElementById(triggerId)?.offsetWidth || 250}px` }}
          className={`relative max-h-[320px] w-auto overflow-y-auto p-0`}
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command>
            <CommandList
              className="scrollable-container max-h-[275px] overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-[17px] [&::-webkit-scrollbar-thumb]:bg-[#00A86B] dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-[#F2F2F2] dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-1"
              onWheel={(e) => e.stopPropagation()}
            >
              <CommandEmpty className="pb-[8px] pt-[14px] text-center">No results found.</CommandEmpty>
              <CommandGroup>
                {options.length > 0 && (
                  <CommandItem key="all" onSelect={toggleAll} className="cursor-pointer">
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        selectedValues.length === options.length
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                      data-test-id="select-all"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    <span>Select All</span>
                  </CommandItem>
                )}
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.id);
                  return (
                    <CommandItem key={option.id} onSelect={() => toggleOption(option.id)} className="cursor-pointer">
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                        )}
                        data-test-id={`select-item-${option.id}`}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <span>{option.name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';
