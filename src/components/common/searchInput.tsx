import React from 'react';
import { Input, InputProps } from '@/components/ui/input';
import { Search } from 'lucide-react';
// Define the InputColor type based on the allowed values in your UI library
type InputColor = 'default' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'danger';
// Create a type that includes all props from InputProps except 'color', and add our own color prop
type SearchInputProps = Omit<InputProps, 'color'> & {
  color?: InputColor;
  placeholder?: string;
};
const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, placeholder = 'Search...', color = 'default', ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          ref={ref}
          type="search"
          className={`pr-10 ${className || ''}`}
          placeholder={placeholder}
          {...props}
          // @ts-expect-error - Input component expects a specific InputColor type
          color={color}
        />
        <Search className="primary pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';
export default SearchInput;
