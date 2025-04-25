'use client';
import { Roles } from '@/types/enum';
import { getStudentMenus } from './user-menus';
import { getAdminMenus } from './admin-menus';

export type SubChildren = {
  href: string;
  label: string;
  active: boolean;
  children?: SubChildren[];
};
export type Submenu = {
  id: string;
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus?: Submenu[];
  children?: SubChildren[];
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  filledIcon: any;
  submenus: Submenu[];
  id: string;
  roles: string[];
  short_name?: string;
  isNew?: boolean;
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
  id: string;
};

export function getMenuList(pathname: string, t: any): Group[] {
  const isAdmin = pathname.split('/').includes(Roles.ADMIN);
  const role: string = isAdmin ? Roles.ADMIN : Roles.STUDENT;
  const menuList = role === Roles.ADMIN ? getAdminMenus(pathname) : role === Roles.STUDENT ? getStudentMenus(pathname) : [];
  return [
    {
      groupLabel: '',
      id: '',
      menus: menuList
    }
  ];
}

export function getHorizontalMenuList(pathname: string, t: any): Group[] {
  return [
    {
      groupLabel: 'dashboard',
      id: 'dashboard',
      menus: [
        {
          id: 'dashboard',
          href: '/',
          label: 'dashboard',
          active: pathname.includes('/'),
          icon: 'heroicons-outline:home',
          filledIcon: 'heroicons:home-20-solid',
          submenus: [],
          roles: ['student']
        }
      ]
    }
  ];
}
