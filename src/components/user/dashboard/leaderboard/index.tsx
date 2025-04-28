'use client';

import { useEffect, useState } from 'react';
import BreadCrumb from '@/components/common/breadcrumb';
import { Separator } from '@/components/ui/separator';
import FilterButton from './FilterButtons';
import LeaderboardTable from './leaderboard-table';
import StatisticsCard from './statistics-card';
import BannerCard from './banner-card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from '@/store';
import {
  fetchQuestionWiseRanking,
  fetchReferralWiseRanking,
  fetchRegionalWiseRanking,
  fetchTimewiseRanking
} from '@/store/slice/user/ranking';

const filterButtons = [
  {
    id: 1,
    name: 'Question Used',
    icon: '/images/icon/note-2.svg',
    filledIcon: '/images/icon/note-2-1.svg'
  },
  {
    id: 2,
    name: 'Time Spent',
    icon: '/images/icon/timer.svg',
    filledIcon: '/images/icon/timer-1.svg'
  },
  {
    id: 3,
    name: 'Referrals',
    icon: '/images/icon/ticket-discount.svg',
    filledIcon: '/images/icon/ticket-discount-1.svg'
  },
  {
    id: 4,
    name: 'Regional',
    icon: '/images/icon/location.svg',
    filledIcon: '/images/icon/location-1.svg'
  }
];

// Mapping between query params and filter button ids
const filterMap: Record<string, number> = {
  questions: 1,
  'time-spent': 2,
  referrals: 3,
  regional: 4
};

const reverseFilterMap: Record<number, string> = {
  1: 'questions',
  2: 'time-spent',
  3: 'referrals',
  4: 'regional'
};

const Leaderboard = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { stream } = useSelector((state) => state.stream);
  const { userId } = useSelector((state) => state.userProfile);
  const { questionwise, timewise, referralwise, regionalwise } = useSelector((state) => state.ranking);
  const regionalType = ['questionwise', 'timewise', 'referralwise'];
  const [currentRegionalTypeIndex, setCurrentRegionalTypeIndex] = useState<number>(0);
  const [selectedFilter, setSelectedFilter] = useState<number>(1);
  const [data, setData] = useState<any>([]);

  const filter = searchParams.get('filter');
  const breadcrumbItems = [{ title: 'Leaderboard', link: '' }];

  // Function to Handle Filter Change
  const handleFilterChange = (filterId: number) => {
    setSelectedFilter(filterId);
    const filterQuery = reverseFilterMap[filterId];
    router.push(`?filter=${filterQuery}`);
  };

  // Function to Handle Regional Filter Change
  const handleRegionalFilterChange = (filterId: number, regionalTypeIndex: number) => {
    setCurrentRegionalTypeIndex(regionalTypeIndex);
    fetchRegionalData(regionalTypeIndex);
  };

  // Function to Get Regional Data
  const fetchRegionalData = (regionalTypeIndex: number) => {
    dispatch(fetchRegionalWiseRanking(userId || 0, stream?.id || 0, regionalType[regionalTypeIndex]));
  };

  const fetchAllRankings = async () => {
    try {
      await Promise.all([
        dispatch(fetchQuestionWiseRanking(userId || 0, stream?.id || 0)),
        dispatch(fetchTimewiseRanking(userId || 0, stream?.id || 0)),
        dispatch(fetchReferralWiseRanking(userId || 0)),
        dispatch(fetchRegionalWiseRanking(userId || 0, stream?.id || 0, regionalType[currentRegionalTypeIndex]))
      ]);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (userId && stream?.id) fetchAllRankings();
  }, [userId, stream]);

  useEffect(() => {
    if (filter && filterMap[filter]) {
      setSelectedFilter(filterMap[filter]);
    }
  }, [filter]);

  useEffect(() => {
    switch (selectedFilter) {
      case 1:
        setData(questionwise);
        break;
      case 2:
        setData(timewise);
        break;
      case 3:
        setData(referralwise);
        break;
      case 4:
        setData(regionalwise);
        break;
      default:
        setData([]);
    }
  }, [selectedFilter, questionwise, timewise, referralwise, regionalwise]);

  return (
    <div className="mx-2 flex h-full min-h-[calc(100vh-6.49rem)] flex-col pt-[0.85rem] sm:mx-4 md:mx-6">
      <BreadCrumb items={breadcrumbItems} title="Dashboard" />
      <Separator />

      <div className="my-3">
        <ScrollArea>
          <div className="flex md:flex-wrap">
            {filterButtons.map((button) => (
              <FilterButton
                key={button.id}
                label={button.name}
                icon={button.icon}
                filledIcon={button.filledIcon}
                selected={selectedFilter === button.id}
                className={`text-xs font-normal md:w-auto md:text-sm ${
                  selectedFilter === button.id ? '' : 'bg-[#2222220A] text-[#6F6F6F]'
                }`}
                color={selectedFilter === button.id ? 'primary' : 'secondary'}
                onClick={() => handleFilterChange(button.id)}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-1" />
        </ScrollArea>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-5 md:grid-cols-1 xl:grid-cols-[3fr_1fr] xl:grid-rows-1">
        <div>
          <LeaderboardTable
            regional={selectedFilter === 4}
            data={data?.ranks || []}
            onRegionalFilterChange={handleRegionalFilterChange}
          />
        </div>
        <div className="flex h-full flex-col gap-5 sm:flex-row xl:flex-col">
          <div className="flex-1">
            <StatisticsCard />
          </div>
          <div className="flex-1">
            <BannerCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
