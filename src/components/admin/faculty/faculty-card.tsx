'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Stream {
  id: number;
  name: string;
}
interface FacultyCardProps {
  id: number;
  name: string;
  profileImage: string | null;
  phoneNumber: string;
  subject: { id: number; name: string };
  streams: Stream[];
  isExpert: boolean;
  isActive: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onInactive: (id: number) => void;
}

const FacultyCard: React.FC<FacultyCardProps> = ({
  id,
  name,
  profileImage,
  phoneNumber,
  subject,
  isExpert,
  streams,
  isActive,
  onEdit,
  onDelete,
  onInactive
}) => {
  return (
    <div className="relative rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between text-sm font-normal text-[#4B4B4B]">
        <h2>
          ID : {id} | {subject.name}
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="icon" className="text-muted-foreground">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isActive && <DropdownMenuItem onClick={() => onEdit(id)}>Edit </DropdownMenuItem>}
            <DropdownMenuItem onClick={() => onDelete(id)}>Delete </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onInactive(id)}>{isActive ? 'Inactive' : 'Active'}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex gap-4">
        {/* Profile Image */}
        <img
          className="!h-24 min-w-24 rounded-md object-cover"
          src={profileImage || '/images/icon/no-avatar.svg'}
          alt={`${name}`}
        />

        {/* Faculty Details */}
        <div className="flex w-full flex-col">
          <div className="mb-4 flex w-full items-center gap-2">
            <h3 className="text-sm font-medium text-B2CAgrayn md:text-base">{name}</h3>
            {isExpert && <img src="/images/icon/award.svg" alt={`${name}`} />}
          </div>

          {/* Contact Info */}
          <div className="mb-4 text-xs font-medium text-B2CAgray md:text-sm">{phoneNumber}</div>
          {/* Streams */}
          <div className="flex flex-wrap gap-[10px]">
            {streams.map((stream, index) => (
              <div
                key={index}
                className="rounded-[1rem] bg-[#00008014] px-3 text-xs font-medium text-primary before:mr-1 before:inline-block before:text-base before:text-primary before:content-['•']"
              >
                {stream.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyCard;
