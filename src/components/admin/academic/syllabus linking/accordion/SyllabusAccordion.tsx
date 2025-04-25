'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Accordion } from '@/components/ui/accordion';
import { CardContent } from '@/components/ui/card';
import { MainDialog } from '@/components/common/MainDialog';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { toast } from 'sonner';
import Apipoint, { FormFields, TosterMessages } from '@/types/enum';
import ChapterAccordion from './ChapterAccordion';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { SyllabusChapter, ViewSyllabus } from '@/types';
import { useDispatch, useSelector } from '@/store';
import { getSingleSyllabus } from '@/store/slice/admin/academic';
import { updateSyllabusChapterTopicsOrder } from '@/utils/api/academic';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SyllabusAccordionProps {
  syllabusForAPI: any;
  title: string;
  open: boolean;
  syllabusData: ViewSyllabus;
  onClose: () => void;
}

const SyllabusAccordion: React.FC<SyllabusAccordionProps> = ({ syllabusForAPI, open, title, syllabusData, onClose }) => {
  const dispatch = useDispatch();
  const [rows, setRows] = useState<SyllabusChapter[]>([]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  // Extract chapter IDs for SortableContext
  const chapterIds = useMemo(() => rows.map((chapter) => chapter.chapterId), [rows]);

  // Update state when syllabusData changes
  useEffect(() => {
    if (syllabusData.syllabus) {
      setRows(syllabusData.syllabus);
    }
  }, [syllabusData]);

  // Handle drag end for sorting
  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((chapter) => chapter.chapterId === active.id);
    const newIndex = rows.findIndex((chapter) => chapter.chapterId === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedRows = arrayMove(rows, oldIndex, newIndex);

    // Converting the data for the API
    const transformedData = {
      chapters: reorderedRows.map((chapter, index) => ({
        chapterId: chapter.chapterId,
        chapterSeq: index + 1,
        topics: chapter.topics.map((topic, tindex) => ({
          topicId: topic.topicId,
          topicSeq: tindex + 1
        }))
      }))
    };

    setRows(reorderedRows);

    // API call for updating the CHAPTER SEQUENCE
    try {
      const response = await updateSyllabusChapterTopicsOrder(
        syllabusData.subjects.id,
        syllabusData.standard.id,
        transformedData
      );
      if (response.status === 200) {
        toast.success(TosterMessages.ADMIN_CHAPTER_UPDATE_SUCCESS);
      } else {
        toast.error(TosterMessages.ADMIN_CHAPTER_UPDATE_FAIL);
      }
      dispatch(getSingleSyllabus(syllabusForAPI.subjects.id, syllabusForAPI.standard.id, syllabusForAPI.qbank_subject_id));
    } catch (error) {
      toast.error(TosterMessages.ADMIN_CHAPTER_UPDATE_FAIL);
    }
  };

  return (
    <MainDialog title={title} isOpen={open} onOpenChange={onClose} size="default">
      <div className="w-full">
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium uppercase text-[#4B4B4B]">{FormFields.STREAM}</h3>
              <div className="w-full rounded-md border p-2 text-sm text-primary">{syllabusData.streams.name}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="mb-2 text-sm font-medium uppercase text-[#4B4B4B]">{FormFields.SUB}</h3>
                <div className="w-full rounded-md border p-2 text-sm text-primary">{syllabusData.subjects.name}</div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium uppercase text-[#4B4B4B]">{FormFields.STANDARD}</h3>
                <div className="w-full rounded-md border p-2 text-sm text-primary">{syllabusData.standard.name}</div>
              </div>
            </div>
          </div>

          {rows.length > 0 ? (
            <ScrollArea className="h-[350px]" type="scroll">
              <Accordion type="single" collapsible className="w-full">
                <DndContext
                  sensors={sensors}
                  modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={chapterIds} strategy={verticalListSortingStrategy}>
                    {rows.map((chapter) => (
                      <ChapterAccordion
                        syllabusForAPI={syllabusForAPI}
                        subjectId={syllabusData.subjects.id}
                        standardId={syllabusData.standard.id}
                        chapters={rows}
                        key={chapter.chapterId}
                        chapterId={chapter.chapterId}
                        chapterName={chapter.chapterName}
                        topics={chapter.topics}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </Accordion>
            </ScrollArea>
          ) : (
            <div className="flex h-[50px] items-center justify-center">
              <p className="text-[#4B4B4B]">No Linked chapters found</p>
            </div>
          )}
        </CardContent>
      </div>
    </MainDialog>
  );
};

export default SyllabusAccordion;
