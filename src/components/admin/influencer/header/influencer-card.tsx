import { Icon } from '@/components/ui/icon';
import { InfluencerTitles } from '@/types/enum';
import Image from 'next/image';
import React from 'react';

type InfluencerCardProps = {
  title: string;
  value: string;
  percentage: string;
  secondaryValue: string;
};

export const influencerIcons: Record<string, string> = {
  'TOTAL INFLUENCERS': '/images/icon/influencer/profile-2user.png',
  'TOTAL ACCOUNTS CREATED': '/images/icon/influencer/people.png',
  'INCOME FROM REFERRALS': '/images/icon/influencer/coin.png',
};

const InfluencerCard: React.FC<InfluencerCardProps> = ({ 
  title, 
  value, 
  percentage, 
  secondaryValue,  
}) => {
  return (
    <div className="rounded-[1rem] bg-white border-borderad p-[6px]">
      <div className="flex justify-between rounded-[12px] border p-4">
        <div>
          <h2 className='text-B2CAgray text-sm lg:text-base font-medium'>{title}</h2>
          <div className="flex items-center justify-start  text-xs lg:text-sm font-medium text-green-600 md:justify-start">
            <span className="mr-2 text-B2CAgrayn text-base md:text-lg">{value}</span>
            <Icon icon={"streamline:graph-arrow-increase"} className="text-sm text-green-600" />
            <h6 className="ml-1 text-sm">+{percentage}%</h6>
          </div>
        </div>
        <div className="h-10 w-10 rounded-[6px] border flex items-center justify-center">
        <Image src={influencerIcons[title]} alt={title} width={24} height={24} />
        </div>
      </div>
      <div className="flex items-center justify-start p-5 text-sm font-medium text-green-600 md:justify-start">
        <h4 className="mr-2 text-B2CAgrayn text-base md:text-lg">{secondaryValue}</h4>
        <span className="text-B2CAgray font-medium text-sm md:text-base">{InfluencerTitles.FROM_LAST_MONTH}</span>
      </div>
    </div>
  );
};

export default InfluencerCard;
