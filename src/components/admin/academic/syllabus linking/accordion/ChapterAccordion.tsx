import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@/components/ui/icon'; // Import the Icon component for drag handle
import TopicAccordion from './TopicAccordion';
import { closestCenter, DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { toast } from 'sonner';
import { TosterMessages } from '@/types/enum';
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SyllabusChapter, SyllabusTopic } from '@/types';
import { useDispatch } from '@/store';
import { getSingleSyllabus } from '@/store/slice/admin/academic';
import { updateSyllabusChapterTopicsOrder } from '@/utils/api/academic';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChapterProps {
  syllabusForAPI: any;
  subjectId: number;
  standardId: number;
  chapterId: number;
  chapterName: string;
  topics: SyllabusTopic[];
  chapters: SyllabusChapter[];
}

const ChapterAccordion: React.FC<ChapterProps> = ({
  syllabusForAPI,
  subjectId,
  standardId,
  chapters,
  chapterId,
  chapterName,
  topics
}) => {
  const dispatch = useDispatch();
  const { isDragging, attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: chapterId });
  const [rows, setRows] = useState<SyllabusTopic[]>([]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  // Extract chapter IDs for SortableContext
  const chapterIds = useMemo(() => rows.map((topic) => topic.topicId), [rows]);

  // Function to get all the chapters Data
  function updateChapterTopics(chapters: SyllabusChapter[], chapterIdToUpdate: number, updatedTopics: any) {
    return chapters.map((chapter) => {
      if (chapter.chapterId === chapterIdToUpdate) {
        return {
          ...chapter,
          topics: updatedTopics.map((topic: any, index: number) => ({
            ...topic,
            topicSequence: index + 1
          }))
        };
      }
      return chapter;
    });
  }

  // Handle drag end for sorting
  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((topic) => topic.topicId === active.id);
    const newIndex = rows.findIndex((topic) => topic.topicId === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedRows = arrayMove(rows, oldIndex, newIndex);

    setRows(reorderedRows);

    // Get all the chapters data
    const updatedChaptersData = updateChapterTopics(chapters, chapterId, reorderedRows);

    const serverData = {
      chapters: updatedChaptersData.map((chapter) => ({
        chapterId: chapter.chapterId,
        chapterSeq: chapter.chapterSequence,
        topics: chapter.topics.map((topic: any) => ({
          topicId: topic.topicId,
          topicSeq: topic.topicSequence
        }))
      }))
    };

    // API call for updating the TOPIC SEQUENCE
    try {
      const response = await updateSyllabusChapterTopicsOrder(subjectId, standardId, serverData);
      if (response.status === 200) {
        toast.success(TosterMessages.ADMIN_TOPIC_UPDATE_SUCCESS);
      } else {
        toast.error(TosterMessages.ADMIN_TOPIC_UPDATE_FAIL);
      }
      dispatch(getSingleSyllabus(syllabusForAPI.subjects.id, syllabusForAPI.standard.id, syllabusForAPI.qbank_subject_id));
    } catch (error) {
      toast.error(TosterMessages.ADMIN_TOPIC_UPDATE_FAIL);
    }
  };

  useEffect(() => {
    if (topics) {
      setRows(topics);
    }
  }, [topics]);

  // Style to handle dragging effect
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
    background: isDragging ? '#f3f4f6' : ''
  };

  return (
    <AccordionItem key={chapterId} value={`chapter-${chapterId}`} ref={setNodeRef} style={style} className="rounded-md">
      <AccordionTrigger className="mr-2 bg-white !p-1 text-left !normal-case text-[#4B4B4B]">
        {/* Drag Handle */}
        <div {...attributes} {...listeners} className="cursor-grab p-2 text-primary" title="Drag to reorder">
          <Icon icon={'material-symbols:drag-indicator'} className="text-2xl" />
        </div>
        <div className="flex-1">{chapterName}</div>
      </AccordionTrigger>

      {/* Accordion Content */}
      <AccordionContent className="!m-0 bg-[#FBFBFD]">
        <ScrollArea
          className={rows.length > 1 ? 'h-[200px]' : 'h-auto'}
          type="scroll"
          style={rows.length > 1 ? { height: '150px' } : { height: 'auto' }}
        >
          <DndContext
            sensors={sensors}
            modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={chapterIds} strategy={verticalListSortingStrategy}>
              {rows.map((topic) => (
                <TopicAccordion key={topic.topicId} topicId={topic.topicId} topic={topic.topic} />
              ))}
            </SortableContext>
          </DndContext>
        </ScrollArea>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ChapterAccordion;
