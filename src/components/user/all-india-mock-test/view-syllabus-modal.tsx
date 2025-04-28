'use client';

import { LucideLoader } from '@/components/common/LucideLoader';
import { MainDialog } from '@/components/common/MainDialog';
import { CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { TosterMessages } from '@/types/enum';
import { Chapter, Subject, SyllabusSection } from '@/types/user';
import { getSyllabusById } from '@/utils/api/exams';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface SyllabusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  examId: number;
}

export default function SyllabusDialog({ open, onOpenChange, examId }: SyllabusDialogProps) {
  const [syllabusData, setSyllabusData] = useState<SyllabusSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
        <CardContent className="mt-5 rounded-md border border-primary pb-0 pl-3 pr-0 md:pl-6">
          <ScrollArea className="h-[50vh]">
            <div className="space-y-6 py-5">
              {loading ? (
                <div className="flex h-[50vh] w-full items-center justify-center">
                  <LucideLoader className="h-8 w-8 text-primary" />
                </div>
              ) : syllabusData.length === 0 ? (
                <div className="flex h-[50vh] w-full items-center justify-center">
                  <p>No syllabus data available.</p>
                </div>
              ) : (
                syllabusData.map((section) => (
                  <div key={section.subjectName} className="space-y-2">
                    <h3 className="text-sm font-medium text-[#222222] sm:text-base lg:text-lg">{section.subjectName}</h3>
                    <ul className="ml-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                      {section.chapterNames.map((chapter: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 mt-2 h-2 w-2 flex-none shrink-0 rounded-full bg-[#6F6F6F]" />
                          <span className="text-sm font-medium text-[#6F6F6F] sm:text-base lg:text-lg">{chapter}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </div>
    </MainDialog>
  );
}
