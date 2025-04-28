'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { ReferralItems } from '@/types/enum';
import Image from 'next/image';
import { getReferralUsedCounts } from '@/utils/api/referral';

const ReferralHeader = () => {
  const [referralData, setReferralData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReferralUsedCounts();
        setReferralData(data);
      } catch (error) {
        console.error('Failed to fetch referral data:', error);
      }
    };

    fetchData();
  }, []);

  const dynamicReferralData = referralData
    ? [
        {
          title: 'TOTAL REFERRAL USED',
          value: referralData.totalReferralUsed.toLocaleString(),
          percentage: '+32.40%', 
        },
        ...referralData.streams.map((stream: any) => ({
          title: stream.name.toUpperCase(),
          value: stream.referralUsed.toLocaleString(),
          percentage: '+32.40%', 
        })),
      ]
    : [];

  return (
    <div className="mb-5 mx-3 overflow-x-auto md:overflow-visible">
      <div className="flex flex-wrap items-center justify-center gap-10 rounded-[0.5rem] border border-borderad bg-white px-5 py-5 md:flex-nowrap md:justify-between md:px-10">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0000800F]">
          <Image src="/images/gift.png" alt="gift" width={44} height={44} />
        </div>
        <div className="flex w-full flex-wrap justify-center gap-5 md:flex-nowrap md:justify-between">
          {dynamicReferralData.map((item, index) => (
            <React.Fragment key={index}>
              <div className="!max-w-[200px] text-center sm:w-auto md:flex-1 md:text-left">
                <h4 className="mb-1 text-base font-medium text-B2CAgrayn">{item.title}</h4>
                <h4 className="mb-4 text-lg font-bold text-B2CAgrayn">{item.value}</h4>
                <div className="flex items-center justify-center text-sm font-medium text-green-600 md:justify-start">
                  <Icon icon="streamline:graph-arrow-increase" className="text-base text-green-600" />
                  <h6 className="ml-1">{item.percentage}</h6>
                  <span className="ml-2 text-B2CAgrayn">{ReferralItems.LAST_MONTH}</span>
                </div>
              </div>
              {index !== dynamicReferralData.length - 1 && <div className="md:border-r-2" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReferralHeader;
