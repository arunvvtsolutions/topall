'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DropDownProps {
  value: string;
  list: { name: string; value: string }[];
  handleChange: (value: string) => void;
  disabled?: boolean;
}

const DropDown: React.FC<DropDownProps> = ({ value, list, handleChange, disabled = false }) => {
  return (
    <Select onValueChange={handleChange} value={value} disabled={disabled}>
      <SelectTrigger
        size="sm"
        color="default"
        className="w-[150px] border-none font-semibold text-secondary-foreground read-only:bg-transparent"
      >
        <SelectValue placeholder={list[0]?.name} className="text-sm !font-semibold text-primary" />
      </SelectTrigger>
      <SelectContent>
        {list.map((item, index) => (
          <SelectItem key={index} value={item.value}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DropDown;
