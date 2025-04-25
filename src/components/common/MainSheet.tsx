import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import React from 'react';

export function MainSheet({
  open,
  title,
  children,
  className,
  footer,
  side,
  setOpen
}: {
  open: boolean;
  title?: string | React.ReactElement;
  children: React.ReactElement;
  className?: string;
  footer?: React.ReactElement;
  side?: 'left' | 'right' | 'top' | 'bottom'
  setOpen: (open: boolean) => void;
}) {
  return (
    <Sheet open onOpenChange={(value) => setOpen(value)}>
      <SheetContent className={cn(`h-full overflow-y-auto bg-[#fff] max-h-[90%] rounded-t-[16px] md:max-h-full md:rounded-none`, className)} side={side}>
        {title &&
          (typeof title === 'string' ? (
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
            </SheetHeader>
          ) : (
            title
          ))}
        <div className="scrollbar-thin grid gap-4 py-4">{children}</div>
        {footer && (
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
