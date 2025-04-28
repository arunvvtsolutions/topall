import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { generateColor } from '@/lib/utils';
import CustomTooltip from '@/components/common/custome-tooltip';

interface Staff {
  id: number;
  name: string;
  imageUrl?: string;
}
interface MultipleAvatarsProps {
  staffList: Staff[];
  size?: number;
}

const MultipleAvatars: React.FC<MultipleAvatarsProps> = ({ staffList, size = 24 }) => {
  return (
    <div className="flex gap-2">
      {staffList.map((staff) => (
        <CustomTooltip
          key={staff.id}
          trigger={
            <Avatar
              style={{
                height: size,
                width: size,
                backgroundColor: staff.imageUrl && staff.imageUrl !== 'EMPTY' ? undefined : generateColor(staff.name)
              }}
            >
              {staff.imageUrl && staff.imageUrl !== 'EMPTY' ? (
                <AvatarImage src={staff.imageUrl} alt={staff.name} />
              ) : (
                <AvatarFallback className="text-xs text-white">
                  {staff.name ? staff.name.charAt(0).toUpperCase() : '?'}
                </AvatarFallback>
              )}
            </Avatar>
          }
          content={staff.name}
          color="info"
          delayDuration={200}
        />
      ))}
    </div>
  );
};

export default MultipleAvatars;
