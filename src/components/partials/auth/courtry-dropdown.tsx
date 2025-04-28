'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ReactCountryFlag from 'react-country-flag';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Countrycodes } from './countrycodes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icon } from '@iconify/react/dist/iconify.js';

interface CountryCodeDropdownProps {
  watch: any;
  setValue: any;
  disabled?: boolean;
}

const CountryCodeDropdown = ({ watch, setValue, disabled }: CountryCodeDropdownProps) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const renderCountryCode = (c_value: string) => {
    const country = Countrycodes.find((country) => country.value === c_value);
    return country ? `+${country.value}` : 'Country Code';
  };

  const filteredCountries = React.useMemo(() => {
    if (search.trim() === '') return Countrycodes;
    return Countrycodes.filter(
      (country) => country.name.toLowerCase().includes(search.toLowerCase()) || country.value.includes(search)
    );
  }, [search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="w-auto justify-between rounded-none bg-transparent !px-2 text-primary hover:rounded-md"
        >
          <>
            <ReactCountryFlag countryCode={watch('countryFlag')} svg />
            <span className="ml-2">{renderCountryCode(watch('countryCode'))}</span>
          </>
          <Icon icon="heroicons:chevron-down" className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[310px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search for a country" value={search} onValueChange={setSearch} />
          <CommandList>
            <ScrollArea className="h-60">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {filteredCountries.map((country) => (
                  <CommandItem
                    key={country.value}
                    className="gap-2"
                    onSelect={() => {
                      setValue('countryCode', country.value);
                      setValue('countryFlag', country.flag);
                      setOpen(false);
                    }}
                  >
                    {/* <Check className={cn('mr-2 h-4 w-4')} /> */}
                    <ReactCountryFlag countryCode={country.flag} svg className="mr-2" />
                    {country.name} +{country.value}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(CountryCodeDropdown);
