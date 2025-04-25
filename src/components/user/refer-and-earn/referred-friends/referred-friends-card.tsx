import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ReferralItems, StatusTitles } from '@/types/enum';
import { ReferredUser } from '@/types/user';
import Image from 'next/image';
import React from 'react';
import { calculateDaysLeft } from '@/utils/date-formatter';

interface ReferredCardprops {
  user: ReferredUser;
  referralCount: number;
  index: number;
}

const ReferredFriendsCard: React.FC<ReferredCardprops> = ({ user, referralCount, index }) => {
  const daysLeft = calculateDaysLeft(user.benefitedDays, user.dateJoined);
  return (
    <Card key={user.studentId} className="!border-none !p-0 !shadow-none">
      <div className={`flex items-center justify-between`}>
        <div className="flex items-center gap-2 md:gap-3">
          <Image
            src={user.profileImage || '/images/logo/logo.svg'}
            className="rounded-lg"
            width={50}
            height={50}
            alt="profile-image"
          />
          <div>
            <h3 className="text-sm font-semibold md:text-base">{user.name}</h3>
            <h4 className="text-xs font-medium text-[#6F6F6F] md:text-sm">{`Gained ${daysLeft} days`}</h4>
          </div>
        </div>
        <div className={`flex flex-col items-end`}>
          <h5 className="text-xs font-medium text-[#6F6F6F] md:text-sm">{user.dateJoined}</h5>
          <span className="mt-1 items-center text-xs font-medium text-success md:text-sm">
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-success" />
            {StatusTitles.COMPLETED}
          </span>
        </div>
      </div>
      {index !== referralCount - 1 && <Separator className="my-4 text-borderad" />}
    </Card>
  );
};

export default ReferredFriendsCard;
