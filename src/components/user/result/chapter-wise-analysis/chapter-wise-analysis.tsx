'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import SelectDropdown from '@/components/common/select-dropdwon';
import { SubjectData } from '../subject-wisemarks/subject-wise-marks';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { LucideLoader } from '@/components/common/LucideLoader';

interface Chapter {
  chapterId: number;
  chapterName: string;
  totalMark: number;
  correct: string[];
  wrong: string[];
  left: string[];
  timeTaken: number;
  accuracy: number;
  subjectId: number;
  percentage: number;
}

export interface ChapterwiseResultProps {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  image_file: string;
  description: string;
  sequence: number;
  is_active: boolean;
  is_deleted: boolean;
  chapterId: number[];
  chapters: Chapter[];
}

export default function ChapterWiseAnalysis({
  chapterwiseResult = [],
  subjectData = [],
  isLoading
}: {
  chapterwiseResult: ChapterwiseResultProps[];
  subjectData: SubjectData[];
  isLoading: boolean;
}) {
  const [selectedSubject, setSelectedSubject] = React.useState(subjectData?.[0]?.id);

  const currentSubject = React.useMemo(() => {
    return chapterwiseResult?.find((c) => c.id === selectedSubject)?.chapters || [];
  }, [chapterwiseResult, selectedSubject]);

  React.useEffect(() => {
    if (subjectData.length) setSelectedSubject(subjectData[0].id);
  }, [subjectData]);

  return (
    <div>
      <h2 className="pb-6 text-xl font-medium">Chapter Wise Analysis</h2>
      <div className="rounded-xl border border-borderad bg-card bg-white p-3 pb-6 text-card-foreground shadow-none md:px-7">
        {isLoading ? (
          <div className="flex min-h-56 items-center justify-center">
            <LucideLoader />
          </div>
        ) : (
          <>
            {currentSubject.length ? (
              <>
                <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-0">
                  <div className="flex w-full flex-nowrap items-center gap-2 overflow-x-auto">
                    {subjectData.map((subject) => (
                      <button
                        key={subject.name}
                        onClick={() => setSelectedSubject(subject.id)}
                        className={cn(
                          'relative px-2 py-6 text-[10px] font-semibold text-[#222222] transition-colors sm:px-4 sm:text-base md:px-4 md:text-base lg:px-4 lg:text-base',
                          selectedSubject === subject.id ? 'font-semibold text-[#000080]' : 'font-semibold text-[#222222]',
                          'whitespace-nowrap'
                        )}
                      >
                        {subject.name}
                        {selectedSubject === subject.id && (
                          <div className="absolute bottom-0 left-2 h-0.5 w-[50px] bg-[#000080] sm:left-3 sm:w-[90px] md:left-3 md:w-[90px] lg:left-3 lg:w-[90px] xl:w-[90px]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <ScrollArea className="mx-2 mt-4 w-full">
                  <div className="h-80 w-full flex-nowrap space-y-6 px-1 pr-7">
                    {currentSubject.map((chapter) => (
                      <div
                        key={chapter.chapterName}
                        className="mb-4 ml-1 sm:mb-6 sm:ml-5 md:mb-6 md:ml-5 lg:mb-6 lg:ml-5 xl:mb-6 xl:ml-8"
                      >
                        <div className="mb-4 text-[12px] font-semibold text-[#222222] sm:text-base md:text-base lg:text-base xl:text-base">
                          {chapter.chapterName}
                        </div>
                        <div className="w-full">
                          <div className="grid grid-cols-7 sm:gap-6 md:gap-8">
                            {['Marks', 'Correct', 'Wrong', 'Left', 'Time', 'Accuracy', 'Percentage'].map((header, index) => (
                              <div
                                key={header}
                                className={`text-[9px] font-medium text-[#6F6F6F] sm:text-base md:text-base lg:text-base xl:text-base`}
                              >
                                {header}
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-7 items-center pt-2 text-left sm:gap-7 md:gap-9">
                            <div className="px-1 text-[10px] font-semibold text-primary sm:px-2 sm:text-base md:px-2 md:text-base lg:px-2 lg:text-base xl:px-2 xl:text-base">
                              {chapter.totalMark}
                            </div>
                            <div className="pl-3 text-[10px] font-semibold text-[#00A86B] sm:px-4 sm:text-base md:px-4 md:text-base lg:px-4 lg:text-base xl:px-4 xl:text-base">
                              {chapter.correct.length}
                            </div>
                            <div className="px-2 text-[10px] font-semibold text-[#FF4747] sm:px-3 sm:text-base md:px-3 md:text-base lg:px-3 lg:text-base xl:px-3 xl:text-base">
                              {chapter.wrong.length}
                            </div>
                            <div className="pl-2 text-[10px] font-semibold text-[#FFAD43] sm:px-2 sm:text-base md:px-2 md:text-base lg:px-2 lg:text-base xl:px-2 xl:text-base">
                              {chapter.left.length}
                            </div>
                            <div className="pr-0 text-[9px] font-semibold text-primary sm:text-base md:text-base lg:text-base xl:text-base">
                              <span className="sm:hidden">{chapter.timeTaken}sec</span>

                              <span className="hidden sm:inline">{chapter.timeTaken}</span>
                            </div>
                            <div className="pr-2 text-[10px] font-semibold text-primary sm:px-3 sm:text-base md:px-3 md:text-base lg:px-3 lg:text-base xl:px-3 xl:text-base">
                              {chapter.accuracy}
                            </div>
                            <div className="px-4 text-[10px] font-semibold text-primary sm:px-5 sm:text-base md:px-5 md:text-base lg:px-5 lg:text-base xl:px-5 xl:text-base">
                              {chapter.percentage || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <>
                <div className="flex h-full min-h-[200px] items-center justify-center">No Data Found</div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
