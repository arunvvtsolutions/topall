'use client';

import { MainDialog } from '@/components/common/MainDialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';
import FilterPills from './filter-pills';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Syllabus } from '@/types/exams';

interface ViewSyllabusProps {
  isLoading: boolean;
  open: boolean;
  title: string;
  onOpenChange: (data: boolean) => void;
  syllabusData: Syllabus[];
}

const ShowSyllabus: React.FC<ViewSyllabusProps> = ({ isLoading, syllabusData, open, title, onOpenChange }) => {
  const [selectedSubject, setSelectedSubject] = useState<Syllabus | null>(null);
  const [filters, setFilters] = useState<any[]>([]);

  useEffect(() => {
    if (syllabusData.length > 0) {
      const initialSubject = syllabusData[0];
      setSelectedSubject(initialSubject);

      const initialFilters = syllabusData.map((syllabus) => ({
        id: syllabus.subjectId,
        name: syllabus.subjectName,
        count: syllabus.totalQuestionsCount,
        active: false
      }));

      initialFilters[0].active = true;
      setFilters(initialFilters);
    }
  }, [syllabusData]);

  // Subject Filter Handler
  const subjectFilterHandler = (selectedCategory: { id: number; name: string; count: number; active?: boolean }) => {
    setFilters(
      filters.map((filter) => ({
        ...filter,
        active: filter.id === selectedCategory.id
      }))
    );

    setSelectedSubject(syllabusData.find((syllabus: Syllabus) => syllabus.subjectId === selectedCategory.id)!);
  };

  return (
    <MainDialog
      isOpen={open}
      title={title}
      onOpenChange={onOpenChange}
      size="md"
      secondaryButton={filters.length > 0 ? <FilterPills categories={filters} onSelect={subjectFilterHandler} /> : null}
    >
      <div className="flex h-[450px] flex-col">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : selectedSubject && selectedSubject.topicsAndChapters.length > 0 ? (
          <ScrollArea className="flex-grow">
            <Accordion type="single" collapsible className="w-full">
              {selectedSubject.topicsAndChapters.map((data, i) => (
                <AccordionItem key={data.chapterId} value={data.chapterName} className="rounded-lg border bg-slate-50">
                  <AccordionTrigger className="border-b">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex gap-2 text-base font-medium text-[#222222] sm:text-lg">
                        <span>{i + 1}</span>
                        <span>{data.chapterName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="ml-2 inline-flex items-center justify-center rounded-lg border border-primary px-[18px] py-[6px] text-xs text-primary sm:text-sm">
                          {data.chapterWiseTopicQuesCount}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="!pb-0">
                    <div
                      className={`grid h-full gap-4 py-2 ${data.topics.length === 1 ? 'w-full grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}
                    >
                      {data.topics.map((topic, j) => (
                        <div key={topic.id} className="flex items-start justify-between rounded-md">
                          <div className="flex items-start gap-2 text-sm font-medium text-[#222222] sm:text-base">
                            <span className="mr-2">
                              {i + 1}.{j + 1}
                            </span>
                            <span className="flex-1">{topic.name}</span>
                          </div>
                          <span className="ml-2 inline-flex items-center justify-center rounded-md border border-primary bg-white px-[18px] py-[6px] text-xs text-primary sm:text-sm">
                            {topic.topicQuesCount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p>No syllabus data available.</p>
          </div>
        )}
      </div>
    </MainDialog>
  );
};

export default ShowSyllabus;
