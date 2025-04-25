'use client';

import React from 'react';

import { useConfig } from '@/hooks/use-config';
import { MenuClassic } from './menu-classic';
import { MenuTwoColumn } from './menu-two-column';
import { MenuDragAble } from './menu-dragable';
import { useMediaQuery } from '@/hooks/use-media-query';

export function Menu() {
  return <MenuClassic />;
}
