'use client';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import React from 'react';
import clsx from 'clsx';
import { convertToMinutesSeconds } from '@/utils';

interface IOETImerProps {
  timerClassName?: string;
  iconClassName?: string;
  className?: string;
  // color: any;
  startExamTime: number;
}

const OETimer = ({ className, timerClassName, iconClassName, startExamTime }: IOETImerProps) => {
  return (
    <Button className={clsx('!rounded-sm hover:bg-none', className)}>
      <span className={clsx(iconClassName)}>
        <Icon icon="iconoir:timer-solid" fontSize={26} />
      </span>
      <span className={clsx(timerClassName)}>{convertToMinutesSeconds(startExamTime)}</span>
    </Button>
  );
};

export default OETimer;
