'use client';

import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Category {
  id: number;
  name: string;
  count: number;
  active?: boolean;
}

interface FilterPillsProps {
  categories: Category[];
  onSelect?: (category: Category) => void;
}

export default function FilterPills({ categories, onSelect }: FilterPillsProps) {
  return (
    <div className="flex w-auto gap-2 overflow-x-auto rounded-md border border-border p-1 sm:w-auto">
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => onSelect?.(category)}
          className={cn(
            'inline-flex items-center rounded-md px-3 py-1 text-sm transition-colors',
            category.active
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-muted text-muted-foreground hover:bg-muted/60'
          )}
        >
          {category.name}
          <Badge
            className={cn(
              'ml-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-center text-xs font-normal leading-5',
              category.active ? 'bg-white text-primary' : 'bg-muted-foreground/20 text-muted-foreground'
            )}
          >
            {category.count}
          </Badge>
        </button>
      ))}
    </div>
  );
}
