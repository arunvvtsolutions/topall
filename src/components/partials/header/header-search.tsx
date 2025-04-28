'use client';
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
// import { Link } from '@/i18n/routing';
import { Icon } from '@/components/ui/icon';
import { useConfig } from '@/hooks/use-config';
import Link from 'next/link';
const HeaderSearch = () => {
  const [config] = useConfig();
  if (config.layout === 'horizontal') return null;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-3 text-lg text-default-800 dark:text-default-700 xl:text-sm xl:text-default-400"
        >
          <Icon icon="heroicons-outline:search" />
          <span className="hidden xl:inline-block">Search... </span>
        </button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <Command className="bg-card">
          <div className="flex items-center border-b border-default-200">
            <CommandInput placeholder="" className="h-14 border-b-0" />
          </div>
          <CommandList className="max-h-[500px] px-3 py-5">
            <CommandEmpty>No results found.</CommandEmpty>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <CommandGroup
                heading="Populer Searches"
                className="[&_[cmdk-group-heading]]:mb-2.5 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-normal [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-default-400"
              >
                <CommandItem className="mb-2.5 p-0 aria-selected:bg-transparent">
                  <Link
                    href="/calendar-page"
                    className="flex items-center gap-1 px-2 text-default-500 hover:text-primary"
                  >
                    <Icon icon="heroicons:calendar-days" />
                    <span>Calendar</span>
                  </Link>
                </CommandItem>
                <CommandItem className="mb-2.5 p-0 aria-selected:bg-transparent">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1 px-2 text-default-500 hover:text-primary"
                  >
                    <Icon icon="heroicons:chart-bar" />
                    <span>Analytics</span>
                  </Link>
                </CommandItem>
                <CommandItem className="mb-2.5 p-0 aria-selected:bg-transparent">
                  <Link
                    href="/ecommerce"
                    className="flex items-center gap-1 px-2 text-default-500 hover:text-primary"
                  >
                    <Icon icon="heroicons:shopping-bag" />
                    <span>eCommerce</span>
                  </Link>
                </CommandItem>
                <CommandItem className="p-0 aria-selected:bg-transparent">
                  <Link
                    href="/project"
                    className="flex items-center gap-1 px-2 text-default-500 hover:text-primary"
                  >
                    <Icon icon="heroicons:building-library" />
                    <span>Project Page</span>
                  </Link>
                </CommandItem>
              </CommandGroup>
              <CommandGroup
                heading="Apps & Pages"
                className="[&_[cmdk-group-heading]]:mb-2.5 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-normal [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-default-400"
              >
                <CommandItem className="mb-2.5 p-0 aria-selected:bg-transparent">
                  <Link
                    href="/chat"
                    className="flex items-center gap-1 px-2 text-default-500 hover:text-primary"
                  >
                    <Icon icon="heroicons:chat-bubble-bottom-center" />
                    <span>Chat</span>
                  </Link>
                </CommandItem>
                <CommandItem className="mb-2.5 p-0 aria-selected:bg-transparent">
                  <Link
                    href="/email"
                    className="flex items-center gap-1 px-2 text-default-500 hover:text-primary"
                  >
                    <Icon icon="heroicons:envelope" />
                    <span>Email</span>
                  </Link>
                </CommandItem>
                <CommandItem className="mb-2.5 p-0 aria-selected:bg-transparent">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1 px-2 text-default-500 hover:text-primary"
                  >
                    <Icon icon="heroicons:user" />
                    <span>Sign In</span>
                  </Link>
                </CommandItem>
                <CommandItem className="p-0 aria-selected:bg-transparent">
                  <Link
                    href="/calendar-page"
                    className="flex items-center gap-1 px-2 text-default-500 hover:text-primary"
                  >
                    <Icon icon="heroicons:chart-bar" />
                    <span>Appex Chart</span>
                  </Link>
                </CommandItem>
              </CommandGroup>
              <CommandGroup
                heading="UI Elements"
                className="[&_[cmdk-group-heading]]:mb-2.5 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-normal [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-default-400"
              >
                <CommandItem className="mb-2.5 p-0 aria-selected:bg-transparent">
                  <Link
                    href="/accordion"
                    className="flex items-center gap-1 px-2 text-default-500 hover:text-primary"
                  >
                    <Icon icon="heroicons:bars-3" />
                    <span>Accordion</span>
                  </Link>
                </CommandItem>
                <CommandItem className="mb-1 p-0 aria-selected:bg-transparent">
                  <Link
                    href="/checkbox"
                    className="flex items-center gap-1 px-2 text-default-500 hover:text-primary"
                  >
                    <Icon icon="heroicons:check" />
                    <span>Checkboxes</span>
                  </Link>
                </CommandItem>
                <CommandItem className="mb-1 p-0 aria-selected:bg-transparent">
                  <Link
                    href="/alert"
                    className="flex items-center gap-1 px-2 text-default-500 hover:text-primary"
                  >
                    <Icon icon="heroicons:megaphone" />
                    <span>Alert</span>
                  </Link>
                </CommandItem>
                <CommandItem className="mb-1 p-0 aria-selected:bg-transparent">
                  <Link
                    href="/pagination"
                    className="flex items-center gap-1 px-2 text-default-500 hover:text-primary"
                  >
                    <Icon icon="heroicons:document-text" />
                    <span>Pagination</span>
                  </Link>
                </CommandItem>
              </CommandGroup>
              <CommandGroup
                heading="Forms & Tables"
                className="[&_[cmdk-group-heading]]:mb-2.5 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-normal [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-default-400"
              >
                <CommandItem className="mb-2.5 p-0 aria-selected:bg-transparent">
                  <Link
                    href="/simple-table"
                    className="flex items-center gap-1 px-2 text-default-500 hover:text-primary"
                  >
                    <Icon icon="heroicons:table-cells" />
                    <span>Simple Table</span>
                  </Link>
                </CommandItem>
                <CommandItem className="mb-2.5 p-0 aria-selected:bg-transparent">
                  <Link
                    href="/tailwindui-table"
                    className="flex items-center gap-1 px-2 text-default-500 hover:text-primary"
                  >
                    <Icon icon="heroicons:table-cells" />
                    <span>Tailwind Ui Table</span>
                  </Link>
                </CommandItem>
                <CommandItem className="mb-2.5 p-0 aria-selected:bg-transparent">
                  <Link
                    href="/data-table"
                    className="flex items-center gap-1 px-2 text-default-500 hover:text-primary"
                  >
                    <Icon icon="heroicons:table-cells" />
                    <span>Tanstack Table</span>
                  </Link>
                </CommandItem>
                <CommandItem className="p-0 aria-selected:bg-transparent">
                  <Link
                    href="/calendar-page"
                    className="flex items-center gap-1 px-2 text-default-500 hover:text-primary"
                  >
                    <Icon icon="heroicons:clipboard-document-list" />
                    <span>Forms</span>
                  </Link>
                </CommandItem>
              </CommandGroup>
            </div>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default HeaderSearch;
