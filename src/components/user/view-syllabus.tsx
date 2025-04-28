'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown } from 'lucide-react';

import { getSyllabusById } from '@/utils/api/exams';
import { LucideLoader } from '@/components/common/LucideLoader';
import { MainDialog } from '@/components/common/MainDialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TosterMessages } from '@/types/enum';
import { Chapter, Subject, SyllabusSection } from '@/types/user';
import { capitalizeFirstLetter } from '@/lib/utils';

interface SyllabusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  examId: number;
}

export default function SyllabusDialog({ open, onOpenChange, examId }: SyllabusDialogProps) {
  const [syllabusData, setSyllabusData] = useState<SyllabusSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  useEffect(() => {
    const getSyllabus = async () => {
      setLoading(true);
      try {
        const response = await getSyllabusById(examId);
        const filteredSyllabus = response.map((item: Subject) => ({
          subjectName: item.subjectName,
          chapterNames: item.topicsAndChapters.map((chapter: Chapter) => chapter.chapterName)
        }));
        setSyllabusData(filteredSyllabus);
      } catch (error) {
        toast.error(TosterMessages.ADMIN_SYLLABUS_FETCH_FAIL);
      } finally {
        setLoading(false);
      }
    };

    getSyllabus();
  }, [examId]);

  return (
    <MainDialog title="Syllabus" isOpen={open} onOpenChange={onOpenChange} size="default">
      <div className="w-full">
        <Separator />
        <div className="h-[400x] space-y-2 overflow-hidden py-5">
          {' '}
          {/* Fixed height container */}
          {loading ? (
            <div className="flex h-full w-full items-center justify-center">
              <LucideLoader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : syllabusData.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center">
              <p>No syllabus data available.</p>
            </div>
          ) : (
            <Accordion
              type="single"
              collapsible
              value={openIndex ?? undefined}
              onValueChange={(value) => {
                setOpenIndex(value === openIndex ? null : value);
              }}
              className="w-full space-y-2"
            >
              {syllabusData.map((section, index) => {
                const id = String(index);
                const isOpen = openIndex === id;

                return (
                  <AccordionItem key={id} value={id} className="> rounded-md border border-[#101010]/15">
                    <AccordionTrigger className="px-4 hover:bg-gray-50">
                      <div className="flex w-full items-center justify-between">
                        <span className="text-left font-medium capitalize text-gray-900">
                          {capitalizeFirstLetter(section.subjectName)}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-[#222222] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="px-4 pb-2 pt-2">
                        <Separator className="mb-4" />
                        <ScrollArea className="max-h-[150px] pr-2">
                          <div className="flex flex-wrap gap-2 pb-2">
                            {section.chapterNames.map((chapter, i) => (
                              <span key={i} className="rounded-md bg-[#f4f4f4] px-4 py-2 text-sm font-medium text-[#6f6f6f]">
                                {capitalizeFirstLetter(chapter)}
                              </span>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </div>
    </MainDialog>
  );
}
