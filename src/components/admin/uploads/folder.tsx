'use client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MoreVertical } from 'lucide-react';
import type React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ButtonNames } from '@/types/enum';

interface FolderProps {
  title: string;
  onEdit?: () => void;
  onDelete: () => void;
  id: number;
}

const Folder: React.FC<FolderProps> = ({ title, onEdit, onDelete, id }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Split path into segments and filter empty values
  const pathSegments = pathname.split('/').filter(Boolean);

  // Construct next navigation path
  let nextPath = `/admin/uploads/${id}`;
  if (pathSegments.length >= 3) {
    // If already inside `/admin/uploads/{id}`, navigate deeper
    nextPath = `${pathname}/${id}`;
  }

  const handleNavigation = () => {
    router.push(nextPath);
  };

  return (
    <div className="flex rounded-lg bg-[#FFFFFF]">
      <div className="flex min-w-0 flex-grow cursor-pointer items-center px-5 py-4" onClick={handleNavigation}>
        <Icon icon="stash:folder-alt" className="text=[#222222] mr-3 flex-shrink-0 text-xl font-medium md:text-2xl" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text=[#222222] truncate text-sm font-medium md:text-base">{title}</span>
            </TooltipTrigger>
            <TooltipContent>{title}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex flex-shrink-0 items-center pr-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="icon" className="h-8 w-8 text-[#4B4B4B]">
              <MoreVertical className="size-5 md:size-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && <DropdownMenuItem onClick={onEdit}>{ButtonNames.EDIT}</DropdownMenuItem>}
            <DropdownMenuItem onClick={onDelete}>{ButtonNames.DELETE}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Folder;
