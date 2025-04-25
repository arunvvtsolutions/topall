'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import LogoutIcon from './logout-icon';
import { DialogTitle, Roles } from '@/types/enum';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import ProfileAvatar from './profile-avatar';
import { GenericType } from '@/types';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useDispatch, useSelector } from '@/store';
import { setStreamSelectionSuccess } from '@/store/slice/user/stream-slice';

interface IProfileHeaderProps {
  user?: {
    userName?: string | null;
    email?: string;
    role?: string;
    streams: GenericType[];
    avatarImageUrl: string | null;
  };
  profileMenu: { name: string; icon: string; href: string }[];
  handleLogout: () => Promise<void>;
  onClose?: () => void;
}

const ProfileHeader = ({ user, profileMenu, handleLogout, onClose }: IProfileHeaderProps) => {
  const [selected, setSelected] = useState('');
  const selectedStream = useSelector((state) => state.stream.stream);
  const userProfile = useSelector((state) => state.userProfile);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.role === Roles.STUDENT) {
      setSelected(selectedStream?.name || '');
    }
  }, [selectedStream]);
  return (
    <div className="w-[17.1875rem] rounded-[0.5rem] border border-borderad bg-white p-[1.5rem_0.625rem_0.250rem]">
      {/* Profile Avatar and Name */}
      <div className="flex items-center gap-4 border-b border-borderad pb-5 pl-[0.5rem]">
        {/* <MultipleAvatars staffList={[{ id: 1, name: user?.userName || 'User' }]} size={42} /> */}
        <ProfileAvatar name={user?.userName} avatarImageUrl={user?.avatarImageUrl} />

        <div>
          <h2 className="text-[1rem] font-medium text-B2CAgrayn">{user?.userName || 'User'}</h2>
          {user?.email && <h6>{user?.email || '-'}</h6>}
        </div>
      </div>

      {/* Stream Selection Buttons */}
      {user?.role === Roles.STUDENT && (
        <div className="border-b py-[0.625rem]">
          <div className="flex flex-wrap gap-[0.5rem] text-nowrap rounded-[0.5rem] bg-[#F6F6F6]">
            {user?.streams.map((stream) => (
              <button
                key={stream.id}
                onClick={() => {
                  setSelected(stream.name);
                  dispatch(setStreamSelectionSuccess({ stream, standards: userProfile.standard }));
                }}
                className={`flex items-center justify-center rounded-[0.5rem] px-[1rem] py-[0.5rem] text-[1rem] font-medium transition-all duration-300 ${
                  selected === stream.name
                    ? 'border border-borderad bg-white text-primary'
                    : 'border border-transparent bg-[#F6F6F6] text-B2Cgray'
                }`}
              >
                {stream.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex w-full flex-col">
        {profileMenu.map((item, index) => (
          <Link href={item.href} key={`info-menu-${index}`} className="w-full cursor-pointer">
            <DropdownMenuItem className="flex w-full cursor-pointer items-center justify-start gap-3 px-3 text-left text-[1rem] font-normal capitalize text-B2Cgray">
              <Icon icon="iconamoon:profile-fill" className="h-5 w-5" />
              {item.name}
            </DropdownMenuItem>
          </Link>
        ))}

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center justify-start gap-3 px-3 text-left text-[1rem] font-normal text-B2Cgray"
        >
          <LogoutIcon />
          {DialogTitle.LOGOUT}
        </DropdownMenuItem>
      </div>
    </div>
  );
};

export default ProfileHeader;
