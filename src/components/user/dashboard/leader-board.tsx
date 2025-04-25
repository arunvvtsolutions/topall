'use client';
import { useEffect, useState } from 'react';
import LeaderCard from './leader-card';
import { useMediaQuery } from '@/hooks/use-media-query';
import LeaderCardMobile from './leader-card-mobile';
import { useDispatch, useSelector } from '@/store';
import {
  fetchQuestionWiseRanking,
  fetchReferralWiseRanking,
  fetchRegionalWiseRanking,
  fetchTimewiseRanking
} from '@/store/slice/user/ranking';
import { toast } from 'sonner';
import { TosterMessages } from '@/types/enum';

const LeaderBoard = () => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(min-width: 768px)');
  const regionalType = ['questionwise', 'timewise', 'referralwise'];
  const { stream } = useSelector((state) => state.stream);
  const { userId } = useSelector((state) => state.userProfile);
  const { questionwise, timewise, referralwise, regionalwise } = useSelector((state) => state.ranking);
  const [currentRegionalTypeIndex, setCurrentRegionalTypeIndex] = useState<number>(0);

  const fetchAllRankings = async () => {
    try {
      if (userId && stream?.id) {
        dispatch(fetchQuestionWiseRanking(userId, stream?.id)),
          dispatch(fetchTimewiseRanking(userId, stream?.id)),
          dispatch(fetchReferralWiseRanking(userId)),
          dispatch(fetchRegionalWiseRanking(userId, stream?.id, regionalType[currentRegionalTypeIndex]));
      }
    } catch (error) {
      console.log('error', error);
      toast.error(TosterMessages.ADMIN_COMMON_ERROR);
    }
  };

  useEffect(() => {
    fetchAllRankings();
  }, [userId, stream]);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {!isMobile ? (
        <LeaderCardMobile />
      ) : (
        <>
          <LeaderCard title="Questions" type="questions" data={questionwise} />
          <LeaderCard title="Time Spent" type="time-spent" data={timewise} />
          <LeaderCard title="Referrals" type="referrals" data={referralwise} />
          <LeaderCard title="Regional" type="regional" data={regionalwise} />
        </>
      )}
    </div>
  );
};

export default LeaderBoard;
