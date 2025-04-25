'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSelector } from '@/store';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatTime, getInitials } from './utils';

interface LeaderCardProps {
  title: string;
  type: string;
  data: any;
}

const LeaderCard = ({ title, type, data }: LeaderCardProps) => {
  const router = useRouter();
  const { name, profileImage } = useSelector((state) => state.userProfile);

  const handleViewFullList = () => {
    router.push(`/dashboard/leaderboard/1?filter=${type}`);
  };

  const getUnitLabel = () => {
    switch (data.type) {
      case 'question-wise':
        return 'Ques';
      case 'time-wise':
        return '';
      case 'referral-wise':
        return 'Referral';
      default:
        return 'Ques';
    }
  };

  if (data && Array.isArray(data.ranks) && data.ranks.length === 0) {
    return null;
  }

  console.log('userData', data);

  return (
    <Card className="flex h-full flex-col border border-borderad shadow-none">
      <CardHeader className="space-y-0 px-4 py-4 text-center">
        <h2 className="text-xl font-medium text-B2CAgrayn">{title}</h2>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-1 flex-col px-4 py-4">
        {/* Top 3 Users */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          {data?.ranks?.slice(0, 3).map((rank: any, index: number) => {
            const initials = getInitials(rank.name);

            return (
              <div className="flex flex-col items-center" key={index}>
                <div className="relative mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-center text-xl font-semibold text-white md:w-16 md:text-2xl">
                  {rank.image_url ? (
                    <img
                      src={rank.image_url || '/placeholder.svg'}
                      className="h-full w-full rounded-full object-cover"
                      alt={`Rank ${index + 1}`}
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-primary text-white">
                      {initials}
                    </span>
                  )}
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h2 className="w-full truncate px-1 text-center text-sm font-medium text-B2CAgrayn md:text-base">
                        {rank.name}
                      </h2>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{rank.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <p className="text-xs font-normal text-B2Cgray md:text-sm">
                  {data.type === 'time-wise' ? formatTime(rank.total) : rank.total} {getUnitLabel()}
                </p>
                <p className="text-xs font-normal text-B2Cgray md:text-sm">Rank {index + 1}</p>
              </div>
            );
          })}
        </div>

        {/* User Position */}
        <div className="mt-auto">
          <h2 className="mb-4 text-base font-medium text-B2Cgray">Your Position</h2>
          <div className="flex items-center justify-between">
            <div className="flex w-full min-w-0 items-center gap-x-2">
              <p className="flex-shrink-0 text-base font-medium text-B2CAgrayn">{data?.currentUser?.rank}</p>
              <div className="flex w-full min-w-0 flex-row items-center gap-x-2">
                <div className="h-10 w-10 flex-shrink-0">
                  {profileImage ? (
                    <img src={profileImage} className="h-full w-full rounded-full object-cover" alt="Your avatar" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-primary text-base font-semibold text-white">
                      {getInitials(name)}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="w-full truncate text-base font-medium text-B2CAgrayn">{name}</h2>
                  <p className="truncate text-sm font-normal text-B2Cgray">
                    {(() => {
                      const total = data?.currentUser?.total;
                      const type = data?.type;

                      if (!total || total === 0) {
                        switch (type) {
                          case 'time-wise':
                            return '0 Time Spent';
                          case 'question-wise':
                            return '0 Ques Attended';
                          case 'referral-wise':
                            return '0 Referrals';
                          case 'regional-wise':
                            return '0 Regionals';
                          default:
                            return 'No Activity';
                        }
                      }

                      return type === 'time-wise' ? formatTime(total) : `${total} ${getUnitLabel()}`;
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="p-4">
        <Button
          variant="default"
          className="group w-full gap-1 border text-B2Cgray hover:bg-B2Cgray/10"
          onClick={handleViewFullList}
        >
          View Full List
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LeaderCard;
