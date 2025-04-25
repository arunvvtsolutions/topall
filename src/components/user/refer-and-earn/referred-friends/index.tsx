'use client';

import { PaginationWithLinks } from '@/components/common/pagination-with-links';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Referral, ReferredUser } from '@/types/user';
import { ReferralItems } from '@/types/enum';
import ReferredFriendsCard from './referred-friends-card';
import { useSelector } from '@/store';
import { fetchReferredStudents } from '@/utils/api/user/refer-and-earn';
import { formatDateMonthDayYear } from '@/utils/date-formatter';

const ReferredFriends = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = useSelector((state) => state.user.userId);

  const [referrals, setReferrals] = useState<Referral | null>(null);
  const [page, setPage] = useState<number>(Number(searchParams.get('page') || '1'));
  const [isReady, setIsReady] = useState<boolean>(false);
  const PAGE_LIMIT = 10;

  // Update Query Params
  const updateQueryParams = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });
    router.push(`?${newSearchParams.toString()}`);
  };

  // Handle Page Change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateQueryParams({ page: newPage.toString() });
  };

  const getReferredStudents = async () => {
    if (!studentId) return;
    try {
      const payload = {
        limit: PAGE_LIMIT,
        page,
        studentId
      };
      const referralData = await fetchReferredStudents(studentId, payload);

      const updatedData = {
        ...referralData,
        referredStudents: referralData.referredStudents.map((student: ReferredUser) => ({
          ...student,
          dateJoined: formatDateMonthDayYear(student.dateJoined)
        }))
      };

      setReferrals(updatedData);
    } catch (error) {
      console.log('Error fetching referred students:', error);
    }
  };

  useEffect(() => {
    if (studentId) {
      setIsReady(true);
    }
  }, [studentId]);

  useEffect(() => {
    if (isReady) {
      getReferredStudents();
    }
  }, [isReady, page]);

  return (
    <div className="mb-20 mt-4 flex h-full min-h-[300px] flex-col rounded-2xl border border-borderad bg-white p-4 md:p-6">
      <h1 className="mb-5 text-lg font-semibold text-[#222222] sm:text-xl md:text-2xl">{ReferralItems.FRIENDS_U_REFERRED}</h1>

      {referrals && referrals.referredStudents.length > 0 ? (
        referrals.referredStudents.map((user, index) => (
          <ReferredFriendsCard key={user.studentId} user={user} referralCount={referrals.referredStudents.length} index={index} />
        ))
      ) : (
        <div className="flex flex-1 items-center justify-center text-center text-gray-500">
          <p>{ReferralItems.NO_REFERRALS_FOUND}</p>
        </div>
      )}
      {referrals && referrals.referredStudents.length > 0 && (
        <div className="mt-6 flex justify-center">
          <PaginationWithLinks
            page={page}
            pageSize={PAGE_LIMIT}
            totalCount={referrals.referredStudentsCount}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ReferredFriends;
