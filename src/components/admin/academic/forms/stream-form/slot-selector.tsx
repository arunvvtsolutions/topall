'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SlotSelectorProps {
  value: number[];
  onChange: (value: number[]) => void;
  className?: string;
  defaultSlots?: number[];
  label: string;
  inputPlaceholder?: string;
  disabledInput?: boolean;
}

export function SlotSelector({
  value,
  onChange,
  className,
  defaultSlots = [],
  label,
  inputPlaceholder,
  disabledInput
}: SlotSelectorProps) {
  const [customSlot, setCustomSlot] = React.useState<string>('');

  const handleSlotToggle = (slot: number) => {
    const currentValue = Array.isArray(value) ? value : [];
    const newValue = currentValue.includes(slot) ? currentValue.filter((s) => s !== slot) : [...currentValue, slot];
    onChange(newValue.sort((a, b) => a - b));
  };

  const handleAddCustomSlot = () => {
    const newSlot = Number.parseInt(customSlot, 10);
    const currentValue = Array.isArray(value) ? value : [];
    if (!isNaN(newSlot) && newSlot > 0 && !currentValue.includes(newSlot)) {
      onChange([...currentValue, newSlot].sort((a, b) => a - b));
      setCustomSlot('');
    }
  };

  return (
    <div className={cn(Array.isArray(value) && value.length > 0 ? 'space-y-4' : '', className)}>
      <div className="flex flex-wrap gap-2">
        {Array.isArray(value) &&
          value
            .filter((slot) => !defaultSlots.includes(slot))
            .map((slot) => (
              <Button
                key={slot}
                type="button"
                variant="outline"
                className={cn('h-8 gap-1 border-[#D9D9D9] text-sm text-[#4B4B4B] hover:bg-primary hover:text-primary-foreground')}
                onClick={() => !disabledInput && handleSlotToggle(slot)}
              >
                <span>
                  {slot} {label}
                </span>
                {!disabledInput && <X className="h-4 w-4 text-inherit" />}
              </Button>
            ))}
      </div>
      {!disabledInput && (
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={inputPlaceholder}
            value={customSlot}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^0-9]/g, '');
              setCustomSlot(numericValue);
            }}
            className="w-full text-sm text-[#4B4B4B]"
            disabled={disabledInput}
          />
          <Button
            type="button"
            onClick={handleAddCustomSlot}
            disabled={!customSlot}
            size="md"
            variant="default"
            color="primary"
            data-testid="add-time-slot"
          >
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
