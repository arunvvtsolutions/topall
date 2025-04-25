'use client';
import Paginate from '@/components/common/pagination';
import { Icon } from '@/components/ui/icon';
import GenerateLanding from '@/components/user/generate-test/generate-landing';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import PeopleIcon from '../../icons/People';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const data = [
  {
    couponCode: 'JEEINTERNAFLAT490',
    price: 490,
    maxUsage: 100,
    validityOptions: [
      { duration: 'Six Months', exam: 'JEE' },
      { duration: 'Till 2025 Exam', exam: 'JEE' },
    ],
    createdAt: '2024-03-11T18:01:00Z',
    expiresAt: '2024-12-31T22:00:00Z'
  },
  {
    couponCode: 'NEETDISCOUNT350',
    price: 350,
    maxUsage: 50,
    validityOptions: [
      { duration: 'Three Months', exam: 'NEET' },
      { duration: 'Till 2025 Exam', exam: 'NEET' }
    ],
    createdAt: '2024-02-20T14:30:00Z',
    expiresAt: '2024-11-30T23:59:00Z'
  },
  {
    couponCode: 'JEEFULLACCESS799',
    price: 799,
    maxUsage: 200,
    validityOptions: [
      { duration: 'One Year', exam: 'JEE' },
      { duration: 'Till 2026 Exam', exam: 'JEE' }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    expiresAt: '2024-12-31T23:59:00Z'
  }
];

const CouponCard = () => {
  const [loading, setLoading] = useState(false);

  const handlePageChange = (page: number) => {
    setLoading(true);
  };
  return (
    <div className="py:2 relative flex min-h-screen flex-col md:py-6">
      {loading ? (
        <div className="absolute left-[50%] top-[15%] flex max-h-[300px] flex-wrap items-center justify-center gap-2 rounded-[8px] lg:top-[40%]">
          <div className="animate-spin">
            <Loader2 className="w-5" />
          </div>
        </div>
      ) : data?.length === 0 ? (
        <GenerateLanding />
      ) : (
        <>
          <div className="grid grid-cols-1 items-center justify-start gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.map((coupon, index) => {
              return (
                <div
                  key={index}
                  className="!border-[rgba(16, 16, 16, 0.15)] mx-auto flex h-full w-full flex-col flex-nowrap justify-between rounded-[16px] !border-[0.5px] border-[0.5px] bg-white md:ml-0 md:mr-auto"
                >
                  <div className="flex flex-nowrap justify-between p-[24px]">
                    <div>
                      <div className="flex flex-nowrap items-center gap-2">
                        <p className="text-nowrap text-[12px] font-[600] text-[#222222] sm:text-[14px]">{coupon.couponCode}</p>
                        <div className="h-[20px] border-r-[2px] border-[#4B4B4B]" />
                        <p className="text-nowrap text-[12px] font-[600] text-[#4B4B4B] sm:text-[14px]">RS {coupon.price}</p>
                        <div className="h-[20px] border-r-[2px] border-[#4B4B4B]" />
                        <p className="flex flex-nowrap items-center gap-[2px] text-nowrap text-[12px] font-[600] text-[#4B4B4B] sm:text-[14px]">
                          <span>
                            <PeopleIcon />{' '}
                          </span>{' '}
                          {coupon.maxUsage}
                        </p>
                      </div>

                      <div className="mt-[12px] sm:mt-[14px] md:mt-[24px]  flex flex-wrap items-center gap-2">
                        {coupon.validityOptions.map((option, index) => {
                          return (
                            <>
                              <p className="text-nowrap text-[12px] font-[400] leading-[18px] text-[#4B4B4B] sm:text-[14px]">
                                {`${option.duration} ( ${option.exam} )`}
                              </p>
                              {index + 1 !== coupon.validityOptions.length && (
                                <div className="h-[20px] border-r-[2px] border-[#4B4B4B]" />
                              )}
                            </>
                          );
                        })}
                      </div>

                      <div className="mt-[12px] sm:mt-[14px] md:mt-[24px] flex flex-nowrap items-center gap-2">
                        <p className="flex flex-nowrap items-center gap-1 text-nowrap text-[14px] font-[400] leading-[18px] text-[#4B4B4B]">
                          {' '}
                          <span>
                            <Icon icon="cuida:calendar-outline" className="h-5 w-5 font-semibold text-[#6F6F6F]" />
                          </span>{' '}
                          11-03-2024
                        </p>
                        <p className="flex flex-nowrap items-center gap-1 text-nowrap text-[14px] font-[400] leading-[18px] text-[#4B4B4B]">
                          <span>
                            <Icon icon="tabler:clock" className="h-5 w-5 font-semibold text-[#6F6F6F]" />
                          </span>
                          6:01 PM
                        </p>
                      </div>
                    </div>
                    <div>
                      <Icon icon="qlementine-icons:menu-dots-16" className="text-xl h-[35px] mt-[-10px] w-[25px]"  />
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between border-t px-[24px] py-[20px]">
                    <p className="text-[10px] font-[500] leading-[18px] text-[#E31717] sm:text-[14px]">
                      Expires on Tuesday, December 31 2024, 10:00PM
                    </p>
                    <div className="flex flex-nowrap items-center justify-center">
                      <div className="relative flex h-[40px] w-[40px] items-center justify-center rounded-[50%] border-[4px] border-solid border-[#fff] bg-[#000080] shadow-md">
                        <span className="absolute right-[-5px] top-[-10px] rounded-[50%] bg-[#FF4747] px-[4px] py-[2px] text-[12px] font-[500] text-[#fff]">
                          10
                        </span>
                        <Icon icon="fluent:people-16-filled" className="h-5 w-5 font-semibold text-[#fff]" />
                      </div>
                      <Avatar className="border-[1px] border-solid border-[#fff] bg-[#FFA126] shadow-md hover:bg-[#FFA126]">
                        <AvatarFallback className="text-[#fff]">Y</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-8">
            <Paginate currentPage={1} totalPages={10} onPageChange={handlePageChange} />
          </div>
        </>
      )}
    </div>
  );
};

export default CouponCard;
