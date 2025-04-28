import React, { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InputFieldProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  label?: string;
  className?: string;
  id?: string;
  dataTestId?: string;
}

const InputField: React.FC<InputFieldProps> = ({ value, onChange, className, placeholder, type, label, id, dataTestId }) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      {label && (
        <Label htmlFor={id} data-test-id={`${dataTestId}-label`}>
          {label}
        </Label>
      )}
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={className}
        placeholder={placeholder}
        data-test-id={dataTestId}
      />
    </div>
  );
};

export default InputField;
