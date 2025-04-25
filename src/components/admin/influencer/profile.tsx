import React from 'react';
import { Icon } from '@/components/ui/icon';
import Image from 'next/image';

interface ProfileCardProps {
  imageUrl: string;
  name: string;
  id: string;
  price: string;
  people: string;
  socialMedia: string[];
}

const ProfileCard: React.FC<ProfileCardProps> = ({ imageUrl, name, id, price, people, socialMedia }) => {
  return (
    <div className="rounded-[1rem] bg-white p-4 border-borderad">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <div className="!h-8 !w-8 md:!h-12 md:!w-12 overflow-hidden rounded-full">
          <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
        </div>
        <div className="!h-8 !w-8 md:!h-12 md:!w-12 flex items-center justify-center rounded-full bg-gray-200 p-2">
          <Icon icon={'teenyicons:top-right-outline'} />
        </div>
      </div>
      <div className="mb-2 flex items-center justify-start gap-2">
        <h2 className="text-lg font-semibold text-black">{name}</h2>
        {socialMedia.includes('YouTube') && <Icon icon="logos:youtube-icon" />}
        {socialMedia.includes('Instagram') && <Icon icon="skill-icons:instagram" />}
      </div>
      <h2 className="text-sm text-B2CAgray mb-2 md:mb-4">{id}</h2>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex w-[125px] justify-center items-center gap-2 rounded-[6px] bg-[#F4F4F4] p-[6px] text-sm font-normal text-[#4B4B4B]">
          <Icon icon={'bx:rupee'} /> {price}
        </div>
        <div className="flex w-[125px] justify-center items-center gap-2 rounded-[6px] bg-[#F4F4F4] p-[6px] text-sm font-normal text-[#4B4B4B]">
          <Image src={'/images/icon/influencer/people.png'} alt={"people"} width={16} height={16} /> {people}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
