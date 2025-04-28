import React, { useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { GenericType } from '@/types';

type SizeOptions = 'sm' | 'md' | 'lg' | 'default';

interface SelectDropdownProps {
  value: GenericType | null | any; // The current selected option
  placeholder?: string;
  data: GenericType[]; // Array of options
  onChange: (value: GenericType) => void; // Callback with the selected option
  name: string;
  width?: string;
  text?: string;
  size?: SizeOptions;
  placeholderColor?: string;
  disabled?: boolean;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  value,
  placeholder,
  data,
  onChange,
  name,
  width = 'w-[180px]',
  text = 'text-primary',
  size = 'sm',
  placeholderColor,
  disabled = false
}) => {
  const [open, setOpen] = useState(false);

  const handleValueChange = (selectedId: any) => {
    const selectedOption = data.find((option) => String(option.id) === String(selectedId));
    if (selectedOption) {
      onChange(selectedOption);
    }
  };

  const placeholderTextColor = placeholderColor || text;

  return (
    <Select
      value={value?.id?.toString() || ''}
      onValueChange={handleValueChange}
      onOpenChange={() => setOpen(!open)}
      data-test-id={`${name}`}
      disabled={disabled}
      aria-label={`${name}-dropdown`}
    >
      <SelectTrigger open={open} className={`${width} ${text}`} size={size}>
        <SelectValue placeholder={placeholder} style={{ color: placeholderTextColor }}>
          {value ? value.name : placeholder}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        <SelectGroup className="select-drop-down-custom max-h-48 overflow-auto">
          {data.map((option) => (
            <SelectItem
              key={option.id}
              value={option.id.toString()}
              className={`cursor-pointer hover:!bg-[#0d068e17] ${value?.id === option.id ? 'bg-primary text-white' : ''}`}
            >
              {option.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectDropdown;
