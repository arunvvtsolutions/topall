import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useSelector } from '@/store';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatTime, getInitials } from '../utils';
import { Separator } from '@/components/ui/separator';

export default function StatisticsCard() {
  const isDesktop = useMediaQuery('(min-width: 1280px)');
  const { name, profileImage } = useSelector((state) => state.userProfile);
  const { questionwise, timewise, referralwise, regionalwise } = useSelector((state) => state.ranking);
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  const [data, setData] = useState<any>(null);
  const [markTitle, setMarkTitle] = useState<string>('');
  const [markContent, setMarkContent] = useState<string>('');

  useEffect(() => {
    let selectedData;
    let markTitle;
    let markContent;
    switch (filter) {
      case 'questions':
        selectedData = questionwise;
        markTitle = 'Ques';
        markContent = 'Questions';
        break;
      case 'time-spent':
        selectedData = timewise;
        markTitle = 'Time';
        markContent = 'Time Spent';
        break;
      case 'referrals':
        selectedData = referralwise;
        markTitle = 'Referral';
        markContent = 'Referrals';
        break;
      default:
        selectedData = regionalwise;
        markTitle = 'Regional';
        markContent = 'Regional';
    }
    setData(selectedData);
    setMarkContent(markContent);
    setMarkTitle(markTitle);
  }, [filter, questionwise, timewise, referralwise, regionalwise]);

  return (
    <Card className="h-auto w-full">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <h1 className="text-lg font-medium text-[#222222]">Your Statistics</h1>

          {/* Responsive Avatar + Info section */}
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Avatar className="size-14 shrink-0 md:size-16 xl:size-20">
              {profileImage ? (
                <AvatarImage src={profileImage} alt="Profile picture" />
              ) : (
                <span className="flex h-full w-full items-center justify-center rounded-full bg-primary text-3xl text-white">
                  {getInitials(name)}
                </span>
              )}
            </Avatar>

            <div className="flex flex-col">
              <h3 className="break-words text-base font-medium text-[#222222] md:text-lg lg:text-xl xl:text-2xl">{name}</h3>
              <p className="text-sm font-normal text-[#6F6F6F] md:text-base">
                {data?.currentUser?.total ? data?.currentUser?.total + ' ' + markContent : '0' + ' ' + markContent}
              </p>
            </div>
          </div>

          {/* Rank Info */}
          <div className="space-y-2">
            <div className="flex justify-between">
              {(() => {
                if (!data?.ranks || data.ranks.length === 0) return null;

                const isEmptyUser = data?.currentUser && Object.keys(data.currentUser).length === 0;
                const total = data.ranks[0]?.total || 0;
                const currentTotal = data?.currentUser?.total || 0;
                const remaining = isEmptyUser ? total : total - currentTotal;

                if (data?.type === 'time-wise') {
                  const formattedTime = formatTime(remaining);

                  if (remaining <= 0 || formattedTime === '0 Sec') {
                    return <span className="text-xs font-semibold text-green-600 md:text-sm">🎉 You&apos;re at the top!</span>;
                  }

                  return (
                    <span className="text-xs font-medium text-black md:text-sm">
                      {formattedTime} more <span className="text-[#6F6F6F]">{markContent?.toLowerCase()} to rank up!</span>
                    </span>
                  );
                } else {
                  if (remaining <= 0) {
                    return <span className="text-xs font-semibold text-primary md:text-sm">You&apos;re at the top!</span>;
                  }

                  return (
                    <span className="text-xs font-medium text-black md:text-sm">
                      {remaining} more <span className="text-[#6F6F6F]">{markContent?.toLowerCase()} to rank up!</span>
                    </span>
                  );
                }
              })()}
            </div>

            <Progress
              value={
                data?.currentUser?.rank === 1
                  ? 100
                  : Math.min(Math.round((data?.currentUser?.total / data?.ranks?.[0]?.total) * 100), 100)
              }
              className="h-2"
              color="primary"
            />
          </div>

          {/* Total Marks */}
          <div className="space-y-4">
            <div className="flex justify-between py-1">
              <span className="text-sm font-medium text-[#222222] md:text-base">Total {markTitle}</span>
              <span className="text-xs font-medium text-[#6F6F6F] md:text-sm">
                {data?.currentUser?.total
                  ? data.type === 'time-wise'
                    ? formatTime(data.currentUser.total)
                    : data?.currentUser?.total
                  : '0' + ' ' + markContent}{' '}
                {data?.currentUser?.total ? markContent : ''}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between py-1">
              <span className="text-sm font-medium text-[#222222] md:text-base">Current Rank</span>
              <span className="text-xs font-medium text-[#6F6F6F] md:text-sm">
                {data?.currentUser?.rank ? 'Rank' + ' ' + data?.currentUser?.rank : 'Unranked'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
