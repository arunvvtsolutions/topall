'use client';

import React, { useState, useEffect, FC, useMemo } from 'react';
import { ProgressSubject } from './progress';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { LucideLoader } from '@/components/common/LucideLoader';

export interface SubjectData {
  id: number;
  name: string;
  percentage: number;
  totalMarks: number;
  correctQuestions: string[];
  wrongQuestions: string[];
  leftQuestions: string[];
  accuracy: number;
}

export interface SectionData {
  id: string;
  name: string;
  subjectId: string;
  totalMarks: number;
  correctQuestions: string[];
  wrongQuestions: string[];
  leftQuestions: string[];
  accuracy: number;
  percentage: number;
  timeSpent: number;
}

interface subjectwiseResultProps {
  sectionData: SectionData[];
  subjectData: SubjectData[];
}

export interface subjectwiseResultApiProps {
  sectionData: SectionData[];
  subjectData: SubjectData;
}

const SubjectResults = ({
  sectionData = [],
  subjectData = [],
  isLoading
}: {
  sectionData: subjectwiseResultApiProps[];
  subjectData: SubjectData[];
  isLoading: boolean;
}) => {
  const [selectedSubject, setSelectedSubject] = useState<number>(subjectData?.[0]?.id);

  const subjectSections = useMemo(() => {
    return sectionData.find((sec) => sec.subjectData.id === selectedSubject);
  }, [selectedSubject, sectionData]);

  const accuracy = useMemo(() => {
    const currentSec = sectionData.find((sec) => sec.subjectData.id === selectedSubject);
    if (currentSec?.sectionData?.length) {
      return currentSec.sectionData.reduce((acc, section) => acc + section.accuracy, 0) / currentSec?.sectionData?.length;
    }
    return subjectData.find((sec) => sec.id === selectedSubject)?.accuracy || 0;
  }, [selectedSubject, sectionData]);

  useEffect(() => {
    if (subjectData.length) setSelectedSubject(subjectData[0].id);
  }, [subjectData]);

  return (
    <div>
      <h2 className="pb-6 text-xl font-medium">Subject Wise Marks</h2>
      <div className="mx-auto w-full rounded-xl border border-borderad bg-card bg-default p-3 sm:p-6 md:p-6 lg:p-6 xl:p-6">
        {isLoading ? (
          <div className="flex min-h-56 items-center justify-center">
            <LucideLoader />
          </div>
        ) : (
          <>
            {subjectData.length ? (
              <>
                <div className="mb-6 ml-2 overflow-x-auto border-b border-[#10101026]">
                  <div className="flex justify-start space-x-4 whitespace-nowrap sm:space-x-6 md:space-x-8 lg:space-x-10 xl:space-x-14">
                    {subjectData.map((subject, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSubject(subject.id)}
                        className={`ml-0 pb-3 text-[12px] font-semibold sm:ml-3 sm:text-lg md:ml-3 md:text-lg lg:ml-3 lg:text-lg xl:ml-7 xl:text-lg ${selectedSubject === subject.id ? 'border-b-2 border-primary text-primary' : 'text-[#222222]'}`}
                      >
                        {subject.name.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4 ml-1 sm:ml-5 md:ml-5 lg:ml-5 xl:ml-8">
                  <div className="flex flex-row items-center justify-between">
                    <div className="w-[70%] sm:w-[80%] lg:w-[82%]">
                      <ProgressSubject value={accuracy} className="rounded-[16px ] h-[10px] w-full bg-[#0D068E24]" />
                    </div>
                    <div className="mt-0 pr-3 text-center sm:pl-4 sm:pr-0 md:pr-3 lg:pr-0 xl:pr-0">
                      <div className="hidden text-sm font-medium text-[#6F6F6F] sm:block sm:text-base md:text-base lg:text-base xl:text-base">
                        Accuracy
                      </div>
                      <span className="text-sm font-semibold text-primary sm:p-2 sm:text-base md:p-2 md:text-base lg:p-12 lg:text-base xl:p-12 xl:text-base">
                        {' '}
                        {accuracy.toFixed(2)}%{' '}
                      </span>
                    </div>
                  </div>
                </div>

                {!subjectSections?.sectionData.length && subjectSections?.subjectData && (
                  <div className="mb-4 ml-1 sm:mb-6 sm:ml-5 md:mb-6 md:ml-5 lg:mb-6 lg:ml-5 xl:mb-6 xl:ml-8">
                    {/* <div className="mb-4 text-[12px] font-semibold text-[#222222] sm:text-base md:text-base lg:text-base xl:text-base">
                        SECTION {name}
                      </div> */}
                    <div className="w-full">
                      <div className="grid grid-cols-6 sm:gap-6 md:gap-8">
                        {['Marks', 'Correct', 'Wrong', 'Left', 'Accuracy', 'Percentage'].map((header, index) => (
                          <div
                            key={header}
                            className={`text-[9px] font-medium text-[#6F6F6F] sm:text-base md:text-base lg:text-base xl:text-base`}
                          >
                            {header}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-6 items-center pt-2 text-left sm:gap-7 md:gap-9">
                        <div className="px-1 text-[10px] font-semibold text-primary sm:px-2 sm:text-base md:px-2 md:text-base lg:px-2 lg:text-base xl:px-2 xl:text-base">
                          {subjectSections?.subjectData.totalMarks}
                        </div>
                        <div className="pl-3 text-[10px] font-semibold text-[#00A86B] sm:px-4 sm:text-base md:px-4 md:text-base lg:px-4 lg:text-base xl:px-4 xl:text-base">
                          {subjectSections?.subjectData.correctQuestions.length}
                        </div>
                        <div className="px-2 text-[10px] font-semibold text-[#FF4747] sm:px-3 sm:text-base md:px-3 md:text-base lg:px-3 lg:text-base xl:px-3 xl:text-base">
                          {subjectSections?.subjectData.wrongQuestions.length}
                        </div>
                        <div className="pl-2 text-[10px] font-semibold text-[#FFAD43] sm:px-2 sm:text-base md:px-2 md:text-base lg:px-2 lg:text-base xl:px-2 xl:text-base">
                          {subjectSections?.subjectData.leftQuestions.length}
                        </div>
                        {/* <div className="pr-0 text-[9px] font-semibold text-primary sm:text-base md:text-base lg:text-base xl:text-base">
                            <span className="sm:hidden">{subjectSections?.subjectData.}sec</span>

                            <span className="hidden sm:inline">{timeSpent}</span>
                          </div> */}
                        <div className="pr-2 text-[10px] font-semibold text-primary sm:px-3 sm:text-base md:px-3 md:text-base lg:px-3 lg:text-base xl:px-3 xl:text-base">
                          {subjectSections?.subjectData.accuracy}
                        </div>
                        <div className="px-4 text-[10px] font-semibold text-primary sm:px-5 sm:text-base md:px-5 md:text-base lg:px-5 lg:text-base xl:px-5 xl:text-base">
                          {subjectSections?.subjectData.percentage}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {subjectSections?.sectionData.map(
                  ({ accuracy, percentage, name, totalMarks, correctQuestions, wrongQuestions, leftQuestions, timeSpent }) => (
                    <div key={name} className="mb-4 ml-1 sm:mb-6 sm:ml-5 md:mb-6 md:ml-5 lg:mb-6 lg:ml-5 xl:mb-6 xl:ml-8">
                      <div className="mb-4 text-[12px] font-semibold text-[#222222] sm:text-base md:text-base lg:text-base xl:text-base">
                        SECTION {name}
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
                            {totalMarks}
                          </div>
                          <div className="pl-3 text-[10px] font-semibold text-[#00A86B] sm:px-4 sm:text-base md:px-4 md:text-base lg:px-4 lg:text-base xl:px-4 xl:text-base">
                            {correctQuestions.length}
                          </div>
                          <div className="px-2 text-[10px] font-semibold text-[#FF4747] sm:px-3 sm:text-base md:px-3 md:text-base lg:px-3 lg:text-base xl:px-3 xl:text-base">
                            {wrongQuestions.length}
                          </div>
                          <div className="pl-2 text-[10px] font-semibold text-[#FFAD43] sm:px-2 sm:text-base md:px-2 md:text-base lg:px-2 lg:text-base xl:px-2 xl:text-base">
                            {leftQuestions.length}
                          </div>
                          <div className="pr-0 text-[9px] font-semibold text-primary sm:text-base md:text-base lg:text-base xl:text-base">
                            <span className="sm:hidden">{timeSpent}sec</span>

                            <span className="hidden sm:inline">{timeSpent}</span>
                          </div>
                          <div className="pr-2 text-[10px] font-semibold text-primary sm:px-3 sm:text-base md:px-3 md:text-base lg:px-3 lg:text-base xl:px-3 xl:text-base">
                            {accuracy}
                          </div>
                          <div className="px-4 text-[10px] font-semibold text-primary sm:px-5 sm:text-base md:px-5 md:text-base lg:px-5 lg:text-base xl:px-5 xl:text-base">
                            {percentage}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </>
            ) : (
              <div className="flex h-full min-h-[200px] items-center justify-center">No Data Found</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SubjectResults;
