'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';

import { Roles, TosterMessages } from '@/types/enum';
import { signOut, useSession } from 'next-auth/react';
import { getIpDetails, studentLogout } from '@/utils/api/auth';
import { useEffect, useState } from 'react';

import ProfileHeader from '@/components/user/profile/profile-header/profile-header';
import { useSelector } from '@/store';
import ProfileAvatar from '@/components/user/profile/profile-header/profile-avatar';
import { toast } from 'sonner';

type menuType = {
  name: string;
  icon: string;
  href: string;
};
const ProfileInfo = () => {
  const { data } = useSession();
  const userProfileData = useSelector((state) => state.userProfile);

  const [isOpen, setIsOpen] = useState(false);
  const isStudent = data?.user.role === Roles.STUDENT;

  //profile menu
  const profileMenu: menuType[] = isStudent ? studentProfileMenu : adminProfileMenu;

  const handleLogout = async () => {
    try {
      // First, remove the cookies
      // await removeCookies();
      if (isStudent) {
        const ipAddress = await getIpDetails();
        await studentLogout({
          logoutIp: ipAddress.ip,
          logoutLocation: ipAddress.city,
          logoutTime: new Date(),
          studentId: data.user.id
        });
        localStorage.removeItem('stream');
        localStorage.removeItem('standard');
      }
    } catch (error) {
      toast.error(TosterMessages.SOMETHING_WENT_WRONG);
      console.error('Error during logout:', error);
    } finally {
      await signOut({
        redirect: false
      });
    }
  };

  return (
    <div className="block">
      <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <div className="flex items-center justify-center gap-3 text-default-800">
            <ProfileAvatar name={userProfileData?.name} avatarImageUrl={userProfileData?.profileImage} />
            <span className="max-w-[100px] overflow-hidden truncate text-ellipsis text-sm font-medium text-[#222222] sm:max-w-[150px]">
              {userProfileData?.name || data?.user?.name}
            </span>
            <Icon icon={isOpen ? 'oui:arrow-up' : 'oui:arrow-down'} className="h-4 w-4 transition-transform duration-200" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="h-full w-auto p-0" align="end">
          <ProfileHeader
            user={{
              userName: userProfileData?.name ?? undefined,
              email: userProfileData?.email ?? undefined,
              role: data?.user?.role,
              streams: userProfileData?.currentExams || [],
              avatarImageUrl: userProfileData.profileImage
            }}
            profileMenu={profileMenu}
            handleLogout={handleLogout}
            onClose={() => setIsOpen(false)}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default ProfileInfo;

//admin
const adminProfileMenu: any[] = [];

//student
const studentProfileMenu = [
  {
    name: 'profile',
    icon: 'heroicons:user',
    href: '/profile'
  }
];
