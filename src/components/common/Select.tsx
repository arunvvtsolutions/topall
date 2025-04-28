'use client';

import type React from 'react';
import { useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import type { GenericType } from '@/types';
import { Icon } from '../ui/icon';

type SizeOptions = 'sm' | 'md' | 'lg' | 'default';

interface SelectDropdownProps {
  value?: GenericType | null | any;
  placeholder?: string;
  data: GenericType[];
  onChange: (value: GenericType) => void;
  name: string;
  width?: string;
  text?: string;
  size?: SizeOptions;
  placeholderColor?: string;
  disabled?: boolean;
  dropdownWidth?: string;
  borderColor?: string;
  borderRadius?: string;
  color?: string;
  height?: string;
  fontWeight?: string;
  fontsize?: string;
  placeholderSize?: string;
  dropdownBg?: boolean;
  primaryIcon?: boolean;
  className?: string;
  emptyLabel?: string;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  value,
  placeholder,
  data,
  onChange,
  name,
  width = 'w-[180px]',
  text = 'text-[#4B4B4B]',
  size = 'sm',
  placeholderColor,
  disabled = false,
  dropdownWidth,
  borderColor,
  borderRadius = 'rounded-md',
  color = 'text-[#4B4B4B]',
  fontWeight = 'font-medium',
  height,
  fontsize,
  placeholderSize,
  dropdownBg = '',
  primaryIcon = true,
  className,
  emptyLabel = 'No Data'
}) => {
  const [open, setOpen] = useState(false);

  const handleValueChange = (selectedName: string) => {
    const selectedOption = data.find((option) => option.name === selectedName);
    if (selectedOption) {
      onChange(selectedOption);
    }
  };

  const placeholderTextColor = placeholderColor || text;

  return (
    <Select
      value={value?.name || ''}
      onValueChange={handleValueChange}
      onOpenChange={() => setOpen(!open)}
      data-test-id={`${name}`}
      disabled={disabled}
      aria-label={`${name}-dropdown`}
    >
      <SelectTrigger
        primaryIcon={primaryIcon}
        open={open}
        className={`${width} ${text} overflow-hidden [&>span]:truncate ${borderColor} ${borderRadius} ${height} ${className}`}
        size={size}
      >
        <span className="flex w-full items-center space-x-2">
          <span className={`truncate ${!value?.name ? placeholderTextColor : ''} ${placeholderSize}`}>
            <SelectValue placeholder={placeholder} />
          </span>
        </span>
      </SelectTrigger>

      <SelectContent className={`${dropdownWidth || 'w-[var(--radix-select-trigger-width)]'} max-w-none`}>
        <SelectGroup className="select-drop-down-custom max-h-48 overflow-auto">
          {data.length > 0 ? (
            data.map((option) => (
              <SelectItem
              key={option.id}
              value={option.name}
              className={`
                cursor-pointer 
                data-[state=checked]:!bg-[#0000800f] 
                hover:!bg-[#0d068e17] 
                ${dropdownBg ? (value?.id === option.id ? 'text-white' : 'text-black') : ''} 
                flex items-center whitespace-nowrap py-2 
                ${option.icon ? 'border-b border-gray-300' : ''}
              `}
            >
            
              <span className="flex w-full items-center justify-between gap-4">
                <span
                  className={`flex-1 truncate ${
                    value?.id === option.id
                      ? 'text-primary font-semibold bg-[#00008005]'
                      : `${color} ${fontWeight}`
                  } ${fontsize}`}
                >
                  {option.name}
                </span>
                {option.icon && <Icon icon={option.icon} className="text-lg text-primary" />}
              </span>
            </SelectItem>            
            ))
          ) : (
            <SelectLabel>{emptyLabel}</SelectLabel>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectDropdown;
