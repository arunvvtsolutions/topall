'use client';
import { Icon } from '@/components/ui/icon';
import Link from 'next/link';
import React, { useState } from 'react';
import PdfCard from './PdfCard';
import PdfPreview from './PdfPreview';
import { DownloadsConstants } from '@/types/enum';

const syllabusData = [
  {
    id: 0,
    name: 'NEET 2025 SYLLABUS',
    date: '11-01-2025 9:00 PM',
    fileSize: '163 Kb',
    file: 'https://localhost:3000/neet-2025',
    description: 'The syllabus for NEET 2025 covers all the subjects required for the entrance examination.'
  },
  {
    id: 1,
    name: 'NEET 2024 SYLLABUS',
    date: '10-01-2024 9:00 PM',
    fileSize: '150 Kb',
    file: 'https://localhost:3000/neet-2024',
    description: 'The syllabus for NEET 2024 includes topics across Physics, Chemistry, and Biology for the entrance exam.'
  },
  {
    id: 2,
    name: 'NEET 2023 SYLLABUS',
    date: '12-01-2023 10:00 AM',
    fileSize: '140 Kb',
    file: 'https://localhost:3000/neet-2023',
    description: 'The syllabus for NEET 2023, which is an essential guide for preparing for the exam.'
  },
  {
    id: 3,
    name: 'NEET 2022 SYLLABUS',
    date: '15-01-2022 11:00 AM',
    fileSize: '180 Kb',
    file: 'https://localhost:3000/neet-2022',
    description: 'The syllabus for NEET 2022, outlining key topics to study for the entrance examination.'
  }
];

const Downloads = () => {
  const [showPdfPreview, setPdfPreview] = useState(false);
  return (
    <>
      <div className="flex !h-full flex-col px-0 sm:px-0 md:px-[32px] lg:!px-[56px]">
        <div className="fixed left-0 top-[60px] flex w-full items-center justify-center bg-[#fff] py-[24px] shadow lg:relative lg:top-0 lg:mb-[35px] lg:justify-start lg:border-b lg:bg-[transparent] lg:pb-[24px] lg:shadow-none">
          <h3 className="hidden text-[16px] font-[600] leading-[29.04px] md:text-[18px] lg:block lg:text-[24px]">Downloads</h3>
          <div className="relative flex w-full items-center justify-center lg:hidden">
            <div className="absolute left-0 col-span-1 mx-4">
              <Icon icon="mingcute:arrow-left-line" />
            </div>
            <h3 className="text-[16px] font-[600] leading-[29.04px] md:text-[18px] lg:block lg:text-[24px]">Downloads</h3>
          </div>
        </div>
        <div className="mt-[100px] grid grid-cols-1 gap-[32px] px-2 lg:mt-0">
          <div className="">
            <div className="flex items-center justify-start gap-5">
              <span className="flex items-center justify-start gap-2 text-[16px] leading-[29.04px] text-[#222222] md:text-[18px] lg:text-[24px]">
                <Icon
                  width="24px"
                  height="24px"
                  icon="proicons:folder"
                  color="#222222"
                  fontSize=""
                  className="h-[24px] w-[24px] text-[24px]"
                />
                {DownloadsConstants.SYLLABUS}
              </span>
              <Link className="text-[14px] font-[500] leading-[19.36px] text-[#000080] underline lg:text-[16px]" href="">
                {DownloadsConstants.VIEW_ALL}
              </Link>
            </div>
            <div className="mt-[24px] grid grid-cols-1 gap-2 sm:grid-cols-2 lg:mt-[32px] lg:grid-cols-3 lg:gap-4">
              {syllabusData.map((s, i) => (
                <PdfCard data={s} key={i} setPdfPreview={setPdfPreview} />
              ))}
            </div>
          </div>
          {/* recent files */}
          <div className="">
            <div className="flex items-center justify-start gap-5">
              <span className="flex items-center justify-start gap-2 text-[16px] leading-[29.04px] text-[#222222] md:text-[18px] lg:text-[24px]">
                <Icon
                  width="24px"
                  height="24px"
                  icon="proicons:folder"
                  color="#222222"
                  fontSize=""
                  className="h-[24px] w-[24px] text-[24px]"
                />
                {DownloadsConstants.RECENT_FILES}
              </span>
              <Link className="text-[14px] font-[500] leading-[19.36px] text-[#000080] underline lg:text-[16px]" href="">
                {DownloadsConstants.VIEW_ALL}
              </Link>
            </div>
            <div className="mt-[24px] grid grid-cols-1 gap-2 sm:grid-cols-2 lg:mt-[32px] lg:grid-cols-3 lg:gap-4">
              {syllabusData.map((s, i) => (
                <PdfCard data={s} key={i} setPdfPreview={setPdfPreview} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {showPdfPreview && <PdfPreview open={showPdfPreview} setOpen={setPdfPreview} />}
    </>
  );
};

export default Downloads;
