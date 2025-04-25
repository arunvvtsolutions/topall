'use client';



import { useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'; // Adjust the import based on the actual library you are using.

type SizeOptions = 'sm' | 'md' | 'lg' | 'default';

type SelectDropdownProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  data: { label: string; value: string }[];
  placeholder: string;
  width: string;
  text: string;
  size: SizeOptions;
  rightIcon?  : any; // Define this if necessary
};

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  name,
  value,
  onChange,
  data,
  placeholder,
  width,
  text = 'text-primary',
  size,
}) => {
  const [open, setOpen] = useState(false);

  const handleValueChange = (selectedValue: string) => {
    // Directly trigger onChange with a simulated event target
    onChange({ target: { value: selectedValue } } as React.ChangeEvent<HTMLSelectElement>);
  };

  return (
    <div className={`relative ${width}`}>
      <Select
        value={value || ''}
        onValueChange={handleValueChange}  
        onOpenChange={() => setOpen(!open)}
        data-test-id={`${name}`}
        aria-label={`${name}-dropdown`}
      >
        <SelectTrigger 
          open={open} 
          className={`w-full ${text} overflow-hidden`} 
          size={size}
          style={{ 
            height: '40px', // Set the fixed height
            padding: '0 10px', // Ensure there's space around the text
            display: 'flex', // Align elements properly
            alignItems: 'center', // Center vertically
            fontSize: '14px', // Set consistent font size
          }}
        >
          <span className="flex w-full items-center space-x-2">
            <span className="truncate">
              <SelectValue
                placeholder={placeholder}
                style={{
                  color: '#8c8c8c', // Adjust placeholderTextColor if needed
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              />
            </span>
          </span>
        </SelectTrigger>

        <SelectContent className="w-[var(--radix-select-trigger-width)] max-w-none">
          <SelectGroup className="select-drop-down-custom overflow-auto" style={{ maxHeight: '200px' }}>
            {data.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className={`cursor-pointer hover:!bg-[#0d068e17] ${value === option.value ? 'bg-primary  text-white' : ''} whitespace-normal break-words py-2`}
                style={{ fontSize: '16px', lineHeight: '20px' }} // Control the font size and line height
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectDropdown;
