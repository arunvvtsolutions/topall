import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateColor } from '@/lib/utils';
import React from 'react';

interface IProfileAvatar {
  name?: string | null;
  avatarImageUrl?: string | null;
}

const ProfileAvatar = ({ name, avatarImageUrl }: IProfileAvatar) => {
  return (
    <Avatar className="bg-[#ECEFFB] hover:bg-[#ECEFFB]">
      {avatarImageUrl ? (
        <AvatarImage src={avatarImageUrl} alt={name || 'User'} />
      ) : (
        <AvatarFallback className="text-xs font-bold text-default-600 lg:text-sm">
          {name ? name.charAt(0).toUpperCase() : ''}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default ProfileAvatar;
