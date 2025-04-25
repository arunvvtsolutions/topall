'use client';

import React, { useEffect } from 'react';
import { ChevronLeft, Ellipsis, LogOut } from 'lucide-react';
// import { usePathname } from '@/components/navigation';
import { cn } from '@/lib/utils';
import { getMenuList } from '@/lib/menus';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { useConfig } from '@/hooks/use-config';
import MenuLabel from '../common/menu-label';
import MenuItem from '../common/menu-item';
import { CollapseMenuButton } from '../common/collapse-menu-button';
import MenuWidget from '../common/menu-widget';
import SearchBar from '@/components/partials/sidebar/common/search-bar';
import TeamSwitcher from '../common/team-switcher';
// import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import { getLangDir } from 'rtl-detect';
import Logo from '@/components/logo';
import SidebarHoverToggle from '@/components/partials/sidebar/sidebar-hover-toggle';
import { useMenuHoverConfig } from '@/hooks/use-menu-hover';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Icon } from '@/components/ui/icon';
import { useSession } from 'next-auth/react';
import { getProfileDetail } from '@/utils/api/user';
import { useDispatch, useSelector } from '@/store';
import {
  setProfileDetailsSucess,
  setStandardSuccess,
  setStreamSelection,
  setStreamsSuccess,
  setUserIdSuccess
} from '@/store/slice/user';
import { setStreamSelectionSuccess } from '@/store/slice/user/stream-slice';
import { toast } from 'sonner';
import { setUserProfileSuccess } from '@/store/slice/user/userProfileSlice';
import { Roles, TosterMessages } from '@/types/enum';
import PreviousChatHistory from './ai/PreviousChatHistory';

export function MenuClassic() {
  const [shortNames, setShortNames] = React.useState<string[]>([]);
  const { data } = useSession();
  const dispatch = useDispatch();
  const testTypes = useSelector((state) => state.testTypes.testTypes);
  // translate
  // const t = useTranslations('Menu');
  const pathname = usePathname();
  const params = useParams<{ locale: string }>();
  const direction = getLangDir(params?.locale ?? '');

  const isDesktop = useMediaQuery('(min-width: 1280px)');

  const menuList = getMenuList(pathname, 'Menu');

  const [config, setConfig] = useConfig();
  const collapsed = config.collapsed;
  const [hoverConfig] = useMenuHoverConfig();
  // const { hovered } = hoverConfig;

  const scrollableNodeRef = React.useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = React.useState(false);

  const toggleSidebar = () => {
    setConfig({
      ...config,
      collapsed: !collapsed
    });
  };

  React.useEffect(() => {
    const handleScroll = () => {
      if (scrollableNodeRef.current && scrollableNodeRef.current.scrollTop > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    scrollableNodeRef.current?.addEventListener('scroll', handleScroll);
  }, [scrollableNodeRef]);

  // useEffect(() => {
  //   const getProfileData = async () => {
  //     try {
  //       if (data && data?.user.role === Roles.STUDENT && data?.user?.mobileNumber) {
  //         // Ensure mobileNumber is defined
  //         const profileResponse = await getProfileDetail(data.user.mobileNumber);

  //         dispatch(setUserProfileSuccess(profileResponse));

  //         const profileData = {
  //           name: profileResponse.name,
  //           email: profileResponse.email,
  //           phone: profileResponse.mobileNumber,
  //           gender: profileResponse.gender,
  //           dob: profileResponse.dob,
  //           standard: profileResponse.standard,
  //           address: profileResponse.address,
  //           country: profileResponse.loginCountry,
  //           state: profileResponse.state,
  //           city: profileResponse.city,
  //           zip_code: profileResponse.zipCode,
  //           role: profileResponse.role.role,
  //           currentExams: profileResponse.currentExams,
  //           referLevel: profileResponse.referLevel
  //         };

  //         dispatch(setStreamsSuccess(profileResponse.currentExams));
  //         dispatch(setUserIdSuccess(profileResponse.userId));
  //         dispatch(setStandardSuccess(profileResponse.standard));
  //         dispatch(setStreamSelectionSuccess({ stream: profileResponse.currentExams[0], standards: profileResponse.standard }));
  //         dispatch(setProfileDetailsSucess(profileData));
  //         await setStreamSelection(profileResponse.currentExams[0]?.id);
  //       }
  //     } catch (error) {
  //       console.log('error', error);
  //       toast.error(TosterMessages.ADMIN_COMMON_ERROR);
  //     }
  //   };
  //   if (data?.user?.mobileNumber) {
  //     getProfileData();
  //   }
  // }, [data?.user?.mobileNumber]);

  useEffect(() => {
    if (testTypes) {
      const short_names = testTypes.map((testType: any) => testType.test_type_list.short_name);
      setShortNames(['', ...short_names]);
    }
  }, [testTypes]);

  return (
    <div
      className={cn(
        'flex h-full flex-col',
        collapsed ? 'w-18' : 'w-full',
        'group bg-primary transition-all duration-300 ease-in-out'
      )}
    >
      {isDesktop && (
        <div className={`relative flex items-center justify-between px-4 !pb-0 ${collapsed ? 'pt-4' : 'pt-4'}`}>
          <Logo collapsed={collapsed} />
          {/* <div
            onClick={toggleSidebar}
            className="absolute right-0 top-24 hidden -translate-y-1/2 translate-x-1/2 cursor-pointer rounded-full border border-primary bg-white p-1 shadow-lg"
          >
            <Icon icon={collapsed ? 'ep:arrow-right-bold' : 'ep:arrow-left-bold'} color="primary" fontSize={16} />
          </div> */}
          {/* Toggle button - only visible on hover */}
          <button
            onClick={toggleSidebar}
            className={cn(
              'absolute -right-3 top-12 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-primary bg-default text-primary opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100',
              collapsed ? 'rotate-180' : ''
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* <ScrollArea className="[&>div>div[style]]:!block" dir={direction}> */}
      {/* {isDesktop && (
          <div
            className={cn('mt-6 space-y-3', {
              'px-4': !collapsed || hovered,
              'text-center': collapsed || !hovered
            })}
          >
            <TeamSwitcher />
            <SearchBar />
          </div>
        )} */}
      <ScrollArea className="h-full [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-8 [&>div>div[style]]:!block">
        <div className="px-4 py-2">
          <PreviousChatHistory />
        </div>
        <nav className={`${collapsed ? 'mt-[42px]' : 'mt-4'} h-full w-full`}>
          <ul className="flex h-full min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1 px-4 lg:min-h-[calc(100vh-32px-40px-32px)]">
            {menuList?.map(({ groupLabel, menus }, index) => (
              <li className={cn('w-full', groupLabel ? '' : '')} key={index}>
                {(!collapsed && groupLabel) || !collapsed === undefined ? (
                  <MenuLabel label={groupLabel} />
                ) : collapsed && !collapsed !== undefined && groupLabel ? (
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger className="w-full">
                        <div className="flex w-full items-center justify-center">
                          <Ellipsis className="h-5 w-5 text-default-700" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{groupLabel}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : null}

                {menus.map(({ href, label, icon, filledIcon, active, id, submenus, roles, short_name, isNew }, index) => {
                  // let isRoleIncluded: boolean | undefined = roles === undefined;
                  // if (!isRoleIncluded) isRoleIncluded = roles?.some((role) => user?.role?.includes(role));
                  if (!roles.includes(data?.user?.role!)) return null;
                  // // if (!isRoleIncluded) isRoleIncluded = roles?.some((role) => user?.role?.includes(role));
                  if (data && data?.user.role === Roles.STUDENT && shortNames && !shortNames?.includes(short_name!)) return null;
                  return submenus.length === 0 ? (
                    <div className="mb-3 w-full last:mb-0" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <div>
                              <MenuItem
                                label={label}
                                icon={icon}
                                filledIcon={filledIcon}
                                href={href}
                                active={active}
                                id={id}
                                collapsed={collapsed}
                                isNew={isNew}
                              />
                            </div>
                          </TooltipTrigger>
                          {collapsed && (
                            <TooltipContent className="bg-default text-black" side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="mb-3 w-full" key={index}>
                      <CollapseMenuButton
                        icon={icon}
                        filledIcon={filledIcon}
                        label={label}
                        active={active}
                        submenus={submenus}
                        collapsed={collapsed}
                        id={id}
                      />
                    </div>
                  );
                })}
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>

      {/* </ScrollArea> */}
    </div>
  );
}
