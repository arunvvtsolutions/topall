'use client';
import React from 'react';
import CircularProgress from './circle-progress';
import { Icon } from '@/components/ui/icon';
import MultipleAvatars from '@/components/admin/sections/multiple-avatars';
import { DialogTitle } from '@/types/enum';
import { ILeaderBoardProps } from '@/types';
import { cn, generateColor } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMediaQuery } from '@/hooks/use-media-query';

const LeaderCard: React.FC<{ data: ILeaderBoardProps; index: number }> = ({ data, index }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isYourRank = index == 0;
  return (
    <div className="relative h-full w-full rounded-[1rem] border border-borderButton p-4">
      <div
        className={cn(
          'absolute right-0 top-0 flex items-center justify-center gap-1 rounded-bl-[0.5rem] rounded-tr-[1rem] bg-[#192b690d] px-2 py-1 text-[14px] font-medium italic text-primary md:min-w-[9.75rem] md:px-4 md:py-2',
          {
            'bg-primary text-default': isYourRank
          }
        )}
      >
        <Icon icon="ic:sharp-star" className="text-base text-warning" />
        <p className="text-sm font-medium md:text-base">
          {isYourRank ? 'Your Rank' : DialogTitle.RANK} {data.rank}
        </p>
      </div>
      <div className="mb-5 mt-8 flex items-center gap-2">
        <Avatar
          style={{
            height: 32,
            width: 32,
            backgroundColor: data.imageUrl && data.imageUrl !== 'EMPTY' ? undefined : generateColor(data.name)
          }}
        >
          {data.imageUrl && data.imageUrl !== 'EMPTY' ? (
            <AvatarImage src={data.imageUrl} alt={data.name} />
          ) : (
            <AvatarFallback className="text-xs font-medium text-default">
              {data.name ? data.name.charAt(0).toUpperCase() : '?'}
            </AvatarFallback>
          )}
        </Avatar>
        <p className="text-wrap text-base font-medium text-primary md:text-lg">{data.name}</p>
      </div>

      <div className="mb-8 flex flex-1">
        <div className="border-r pr-6">
          <CircularProgress value={data.percentage} size={isMobile ? 100 : isTablet ? 110 : 120} />
        </div>
        <div className="flex-1 pl-5">
          <div className="border-b border-[#E1E1E1] pb-2.5">
            <p className="text-center text-sm font-medium text-[#191B1F]">{DialogTitle.MARKS}</p>
            <p className="text-center text-sm font-semibold text-[#0D068E] md:text-base">{data.totalMarks}</p>
          </div>
          <div className="pt-2.5">
            <h3 className="text-center text-sm font-medium text-[#191B1F]">{DialogTitle.ACCURACY}</h3>
            <h3 className="text-center text-sm font-semibold text-[#0D068E] md:text-base">{data.accuracy}</h3>
          </div>
        </div>
      </div>
      <div>
        {data.subjects.map((subject, index) => (
          <div
            key={index}
            className={`flex justify-between ${index !== data.subjects.length - 1 ? 'border-b border-dashed border-[#191B1F]' : ''} mt-2 border-[#191B1F] pb-2`}
          >
            <h3 className="text-center text-[0.875rem] font-medium text-[#191B1F]">{subject.subjectName}</h3>
            <h3 className="text-center text-[0.875rem] font-semibold text-[#0D068E]">{subject.totalMarks}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderCard;
