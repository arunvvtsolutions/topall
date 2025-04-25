'use client';

import type React from 'react';
import Image from 'next/image';
import { MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { GenericType } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { Icon } from '@/components/ui/icon';

interface CarouselCardProps {
  row: any;
  index: number;
  title?: string;
  description?: string;
  stream?: string;
  standard?: GenericType[];
  image?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  hideDrag?: boolean;
}

const CarouselCard: React.FC<CarouselCardProps> = ({
  row,
  index,
  title,
  stream,
  standard,
  image,
  description,
  onEdit,
  onDelete,
  hideDrag
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 1 : 'auto'
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl items-start rounded-lg" ref={setNodeRef} style={style}>
      {/* Drag Icon (Left Side) */}
      <div className="flex w-full items-start rounded-2xl bg-white">
        {!hideDrag && (
          <div {...attributes} {...listeners} className="mt-3 hidden cursor-grab px-2 md:flex">
            <Button size="icon" variant="outline" className="h-[25px] w-[25px] items-start border-none bg-transparent">
              <Icon icon="material-symbols:drag-indicator" className="cursor-grab text-2xl text-primary transition-all" />
            </Button>
          </div>
        )}
        <div className="w-full">
          <div className="relative h-[100px] w-full overflow-hidden rounded-bl-lg rounded-br-lg rounded-tr-lg md:h-[180px]">
            <Image src={image!} alt="Educational features banner" fill className="object-cover" priority />
          </div>

          <Card className="flex h-[180px] w-full flex-col rounded-none rounded-b-2xl border-0 shadow-none">
            <CardHeader
              className={`relative mb-2 flex flex-wrap ${hideDrag ? 'ml-0 md:ml-6' : ''} items-start justify-start px-3 py-2 pr-12 md:px-6 md:!pl-0`}
            >
              {/* Left Section: Title, Stream, and Standard */}
              <div className="flex flex-1 flex-wrap items-center gap-2 overflow-hidden">
                <h2 className="text-sm font-medium text-[#222222] md:text-base">{title}</h2>
                <Separator orientation="vertical" className="h-4 w-[2px] flex-shrink-0 bg-B2CAgray/50" />
                <span className="text-xs font-semibold text-[#6F6F6F] md:text-sm">{stream}</span>
                <Separator orientation="vertical" className="h-4 w-[2px] flex-shrink-0 bg-B2CAgray/50" />

                <div className="flex flex-wrap items-center gap-2">
                  {standard &&
                    standard?.map((item: any, index) => (
                      <span key={index} className="flex items-center text-xs font-semibold text-[#6F6F6F] md:text-sm">
                        {item.name}
                        {index < standard.length - 1 && (
                          <Separator orientation="vertical" className="ml-2 h-4 w-[2px] flex-shrink-0 bg-B2CAgray/50" />
                        )}
                      </span>
                    ))}
                </div>
              </div>

              {/* Right Section: Dropdown Menu */}
              <div className="absolute right-4 top-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" size="icon" className="h-8 w-8 text-[#4B4B4B]">
                      <MoreVertical className="size-5 md:size-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEdit}>Edit Carousel</DropdownMenuItem>
                    <DropdownMenuItem onClick={onDelete}>Delete Carousel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            {/* Description */}
            <CardContent className={` ${hideDrag ? 'ml-0 md:ml-6' : ''} flex-1 px-3 pb-3 pt-0 md:px-6 md:!pl-0`}>
              <p className="line-clamp-4 overflow-hidden text-ellipsis text-xs font-normal leading-relaxed text-gray-600 sm:text-sm">
                {description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CarouselCard;
