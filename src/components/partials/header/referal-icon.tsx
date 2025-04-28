'use client';
import { Icon } from '@/components/ui/icon';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const ReferalIcon = () => {
  return (
    <div className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-borderad sm:size-9 md:size-10">
      <Image src="/images/icon/icons8-gift-box.svg" alt="referal-icon" className="size-5 md:size-6" width={50} height={50} />
    </div>
  );
};

export default ReferalIcon;
