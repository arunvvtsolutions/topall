import { GenerateTestType } from '@/types/enum';
import Image from 'next/image';
import React from 'react';

const GenerateLanding = ({ description = GenerateTestType.QUOTES }: { description?: string }) => {
  return (
    <div className="flex h-[350px] flex-col items-center justify-center sm:h-[600px]">
      <div className="relative mb-6 h-[200px] w-[200px] sm:h-[284px] sm:w-[284px]">
        <Image src="/images/users/user-icon.webp" alt="user-icon" fill className="object-contain" />
      </div>
      <h2 className="text-[rgba(34, 34, 34, 1)] text-center text-[16px] sm:text-[18px]">{description}</h2>
    </div>
  );
};

export default GenerateLanding;
