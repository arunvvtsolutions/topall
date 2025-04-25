import Image from 'next/image';
import { ReferralItems } from '@/types/enum';
import { Icon } from '@/components/ui/icon';

interface StatCardProps {
  title: string;
  value: string | number;
  percentage: string;
  icon: string;
}

export const referralIcons: Record<string, string> = {
  'REFERRED STUDENTS': '/images/icon/influencer/people.png',
  'TOTAL INCOME': '/images/icon/influencer/coin.png',
  'COMMISSION': '/images/icon/influencer/group.png',
};

const HeaderCard = ({ title, value, percentage }: StatCardProps) => {
  return (
    <div className="w-full rounded-[0.5rem] flex items-center justify-between gap-6 border bg-white p-6">
      <div>
        <h2 className="text-base mb-1 text-B2CAgrayn whitespace-nowrap">{title}</h2>
        <h2 className="text-lg font-bold mb-2">{value}</h2>
        <div className="flex items-center justify-center text-sm font-medium text-green-600 md:justify-start">
        <Icon icon="streamline:graph-arrow-increase" className="mr-2 text-base text-green-600" />
          <h4 className="mr-2 text-sm text-green-600">{percentage}</h4>
          <span className="text-sm font-normal text-B2CAgray">{ReferralItems.LAST_MONTH}</span>
        </div>
      </div>
      <div className="h-10 w-10   flex items-center justify-center">
        <Image src={referralIcons[title]} alt={title} width={40} height={40} />
      </div>
    </div>
  );
};

export default HeaderCard;
