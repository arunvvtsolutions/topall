'use client';

import type { FC } from 'react';
import { MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface FileItem {
  id: string;
  title: string;
  date: string;
  time: string;
  size: string;
}

interface PDFCardProps {
  file: FileItem;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const PDFCard: FC<PDFCardProps> = ({ file, onEdit = () => {}, onDelete = () => {} }) => {
  return (
    <div className="flex rounded-lg bg-white">
      <div className="flex min-w-0 flex-grow items-center px-5 py-4">
        <Image src="/images/icon/pdf.svg" width={45} height={45} alt="pdf-image" className="mr-3" />

        <div className="flex-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="max-w-[180px] truncate text-sm font-medium text-[#222222] sm:max-w-[160px] md:max-w-[140px] lg:max-w-[200px] lg:text-base 2xl:max-w-[280px]">
                  {file.title}
                </p>
              </TooltipTrigger>
              <TooltipContent>{file.title}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="max-w-[180px] truncate text-xs mt-1 font-normal text-[#6F6F6F] sm:max-w-[160px] md:max-w-[140px] lg:max-w-[200px] lg:text-sm 2xl:max-w-[280px]">
                  {file.date} {file.time} • {file.size}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                {file.date} {file.time} • {file.size}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex-shrink-0 pr-3 pt-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 items-center justify-center rounded-full text-[#4B4B4B] hover:bg-muted"
            >
              <MoreVertical className="size-5 md:size-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(file.id)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(file.id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default PDFCard;
