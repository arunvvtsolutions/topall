import React from 'react';
import CountryCodeDropdown from '../partials/auth/courtry-dropdown';
import { Input } from '../ui/input';

interface IMobileNumberInput {
  label?: string;
  id: string;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: 'on' | 'off';
  watch: any;
  setValue: any;
  register: any;
  errors: any;
}

const MobileNumberInput = ({
  id,
  placeholder = 'Enter Mobile Number',
  disabled = false,
  watch,
  setValue,
  register,
  errors
}: IMobileNumberInput) => {
  return (
    <div className="flex items-center border border-borderad">
      <CountryCodeDropdown watch={watch} setValue={setValue} />
      <Input
        id={id}
        size="lg"
        type="text"
        placeholder={placeholder}
        className="border-none text-base font-medium"
        {...register('mobileNumber', {
          required: 'This field is required.'
        })}
        value={watch('mobileNumber')}
        errors={errors}
      />
    </div>
  );
};

export default MobileNumberInput;
