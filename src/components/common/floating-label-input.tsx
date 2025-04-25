import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  floatingLabel?: string;
  borderColor?: string; // CSS class for border and label text color
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ className, floatingLabel, borderColor = "border-gray-300 text-gray-500", ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!props.value);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
      setIsFocused(false);
      if (!props.value) setHasValue(false);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!hasValue && e.target.value) setHasValue(true);
      if (hasValue && !e.target.value) setHasValue(false);
      if (props.onChange) props.onChange(e);
    };

    return (
      <div className="relative">
        {/* Floating Label */}
        {floatingLabel && (
          <label
          htmlFor={props.id}
          className={cn(
            `absolute left-2 text-xs bg-white px-1 mt-[-9px]`,
            borderColor
          )}
        >
          {floatingLabel}
        </label>
        )}

        {/* Input */}
        <input
          {...props}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={cn(
            `w-full px-4 py-2 text-sm border rounded-md focus:outline-none bg-white`,
            borderColor, // Apply borderColor to input
            className
          )}
        />
      </div>
    );
  }
);

FloatingLabelInput.displayName = 'FloatingLabelInput';

export { FloatingLabelInput };
