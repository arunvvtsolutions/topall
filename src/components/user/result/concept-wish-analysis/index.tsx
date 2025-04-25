'use client';
import SelectDropdown from '@/components/common/SelectSecondary';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ButtonNames, CardItems, ResultTitle } from '@/types/enum';
import * as React from 'react';
import { SubjectData } from '../subject-wisemarks/subject-wise-marks';
import { ChapterwiseResultProps } from '../chapter-wise-analysis/chapter-wise-analysis';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { LucideLoader } from '@/components/common/LucideLoader';

export type ConceptwiseResultProps = {
  topicId: number;
  topicName: string;
  chapterId: number;
  chapterName: string;
  subjectId: number;
  subjectName: string;
  totalMarks: number;
  correctQuestions: string[];
  incorrectQuestions: string[];
  leftQuestions: string[];
  accuracy: number;
  percentage: number;
  timeSpent: number;
};

interface IConceptWiseAnalysis {
  subjectData: SubjectData[];
  conceptwiseData: ConceptwiseResultProps[];
  chapterwiseResult: ChapterwiseResultProps[];
  isLoading: boolean;
}

export default function ConceptWiseAnalysis({
  subjectData = [],
  conceptwiseData = [],
  chapterwiseResult = [],
  isLoading
}: IConceptWiseAnalysis) {
  const [selectedSubject, setSelectedSubject] = React.useState(0);
  const [selectedChapter, setselectedChapter] = React.useState<any>({ id: 0, name: 'All Chapters' });

  const conceptSelectionHandler = (selectedValue: any) => {
    setselectedChapter(selectedValue);
  };

  const chapters = React.useMemo(() => {
    return [
      { id: 0, name: 'All Chapters' },
      ...(chapterwiseResult
        .find((sub) => sub.id === selectedSubject)
        ?.chapters.map((c) => ({ name: c.chapterName, id: c.chapterId })) || [])
    ];
  }, [chapterwiseResult, selectedSubject]);

  const conceptwiseResult = React.useMemo(() => {
    if (selectedChapter.id) {
      return (
        conceptwiseData.filter((concept) => concept.subjectId === selectedSubject && concept.chapterId === selectedChapter.id) ||
        []
      );
    }
    return conceptwiseData?.filter((concept) => concept.subjectId === selectedSubject);
  }, [conceptwiseData, selectedSubject, selectedChapter]);

  React.useEffect(() => {
    if (subjectData.length) setSelectedSubject(subjectData[0].id);
  }, [subjectData]);

  return (
    <div>
      <h2 className="mb-5 text-xl font-medium text-B2CAgrayn">{ResultTitle.CONCEPT_WISE_ANALYSIS}</h2>
      <div className="mx-auto w-full rounded-xl border border-borderad bg-white p-3 pb-6 md:px-6">
        {/* Header with Subject Tabs and Dropdown */}
        {isLoading ? (
          <div className="flex min-h-56 items-center justify-center">
            <LucideLoader />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-borderad pb-0">
              {/* Horizontal Scroll for Subject Tabs */}
              <div className="flex flex-nowrap items-center gap-2 md:basis-8/12">
                {subjectData.map((subject) => (
                  <button
                    key={subject.name}
                    onClick={() => setSelectedSubject(subject.id)}
                    className={cn(
                      'relative px-2 py-6 text-[0.625rem] font-semibold text-B2CAgrayn transition-colors sm:px-4 sm:text-base md:px-4 md:text-lg lg:px-4',
                      selectedSubject === subject.id ? 'font-semibold text-primary' : 'font-semibold text-B2CAgrayn',
                      'whitespace-nowrap'
                    )}
                  >
                    {subject.name}
                    {selectedSubject === subject.id && (
                      <div className="absolute bottom-0 left-[0.125rem] h-[0.125rem] w-[3.125rem] bg-primary sm:left-[0.1875rem] sm:w-[5.625rem] md:left-[0.1875rem] md:w-[5.625rem] lg:left-[0.1875rem] lg:w-[5.625rem] xl:w-[5.625rem]" />
                    )}
                  </button>
                ))}
              </div>
              <div className="basis-full md:basis-2/12">
                <SelectDropdown
                  data={chapters}
                  value={selectedChapter}
                  onChange={(selectedOption) => {
                    conceptSelectionHandler(selectedOption);
                  }}
                  placeholder="Select"
                  name={'concept'}
                  size="default"
                  width="100%"
                  text="text-primary"
                  // text="truncate"
                  // disabled={loading || type === FormType.VIEW}
                />
              </div>
            </div>
            <ScrollArea className="mx-2 mt-4 h-[calc(70vh-15.625rem)] w-full overflow-x-auto sm:h-[calc(65vh-15.625rem)] md:h-[calc(65vh-15.625rem)] lg:h-[calc(55vh-15.625rem)] xl:h-[calc(55vh-15.625rem)]">
              <div className="w-full flex-nowrap space-y-6 px-1 pr-7">
                {conceptwiseResult.length === 0 ? (
                  <>
                    <div className="flex h-full min-h-[200px] items-center justify-center">No Data Found</div>
                  </>
                ) : (
                  conceptwiseResult.map((topic) => (
                    <div
                      key={topic.topicName}
                      className="mb-4 ml-1 sm:mb-6 sm:ml-5 md:mb-6 md:ml-5 lg:mb-6 lg:ml-5 xl:mb-6 xl:ml-8"
                    >
                      <div className="mb-4 text-[12px] font-semibold text-[#222222] sm:text-base md:text-base lg:text-base xl:text-base">
                        {topic.topicName}
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
                            {topic.totalMarks}
                          </div>
                          <div className="pl-3 text-[10px] font-semibold text-[#00A86B] sm:px-4 sm:text-base md:px-4 md:text-base lg:px-4 lg:text-base xl:px-4 xl:text-base">
                            {topic.correctQuestions.length}
                          </div>
                          <div className="px-2 text-[10px] font-semibold text-[#FF4747] sm:px-3 sm:text-base md:px-3 md:text-base lg:px-3 lg:text-base xl:px-3 xl:text-base">
                            {topic.incorrectQuestions.length}
                          </div>
                          <div className="pl-2 text-[10px] font-semibold text-[#FFAD43] sm:px-2 sm:text-base md:px-2 md:text-base lg:px-2 lg:text-base xl:px-2 xl:text-base">
                            {topic.leftQuestions.length}
                          </div>
                          <div className="pr-0 text-[9px] font-semibold text-primary sm:text-base md:text-base lg:text-base xl:text-base">
                            <span className="sm:hidden">{topic.timeSpent}sec</span>

                            <span className="hidden sm:inline">{topic.timeSpent}</span>
                          </div>
                          <div className="pr-2 text-[10px] font-semibold text-primary sm:px-3 sm:text-base md:px-3 md:text-base lg:px-3 lg:text-base xl:px-3 xl:text-base">
                            {topic.accuracy}
                          </div>
                          <div className="px-4 text-[10px] font-semibold text-primary sm:px-5 sm:text-base md:px-5 md:text-base lg:px-5 lg:text-base xl:px-5 xl:text-base">
                            {topic.percentage}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  );
}
