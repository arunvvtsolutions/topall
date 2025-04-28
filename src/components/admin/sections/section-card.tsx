'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  DndContext,
  useSensors,
  useSensor,
  DragOverlay,
  type DragStartEvent,
  closestCenter,
  MouseSensor,
  TouchSensor,
  type DragEndEvent
} from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import SectionFormModal from './section-form';
import { useDispatch, useSelector } from '@/store';
import { getSectionsByExamId, updateSectionSequence } from '@/store/slice/exam/sections';
import { useParams } from 'next/navigation';
import DraggableCard from './draggable-card';
import { AdminOnlyGroups, DialogTitle, FormType, Roles } from '@/types/enum';
import toast from 'react-hot-toast';
import { getExamStreamById } from '@/utils/api/section';
import { getSingleTest } from '@/utils/api/exams';
import { useSession } from 'next-auth/react';

const MemoizedDraggableCard = React.memo(DraggableCard);

const SectionCards = ({ singleTest, setMarks }: { singleTest: any; setMarks: (marks: number) => void }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userProfile);

  const [addSubject, setAddSubject] = useState(false);
  const [activeId, setActiveId] = useState<any>(null);
  const { sections } = useSelector((state) => state.examSections);
  const { examId } = useParams();
  const [testDetails, setTestDetails] = useState<any>(null);
  const [singleExam, setSingleExam] = useState<any>(null);
  const [sectionList, setSectionList] = useState<any[]>([]);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const sectionIds = useMemo(() => sectionList.map((item) => item.id), [sectionList]);
  const [addedMarks, setAddedMarks] = useState<number>(0);

  useEffect(() => {
    setSectionList(sections);
    const totalAddedMarks = sections.reduce((total, section) => total + section.totalMark, 0);
    setAddedMarks(totalAddedMarks);
    setMarks(totalAddedMarks);
  }, [sections, setMarks]);

  useEffect(() => {
    dispatch(getSectionsByExamId(String(examId)));
  }, [examId, dispatch]);

  // Fetch singleExam details
  useEffect(() => {
    setSingleExam(singleTest);
  }, [singleTest]);

  // Fetch test details based on singleExam.streamId
  useEffect(() => {
    const fetchTestDetails = async () => {
      if (!singleExam?.streamId) return;

      try {
        const response = await getExamStreamById(String(singleExam.streamId));
        setTestDetails(response);
      } catch (error) {
        console.error('Error fetching stream details:', error);
        toast.error('Failed to fetch stream details.');
      }
    };

    fetchTestDetails();
  }, [singleExam?.streamId]);

  // Calculate the total score of all sections
  const totalSectionScore = useMemo(
    () =>
      sections.reduce((total, section) => {
        return total + section.maxAttempts * section.cMark;
      }, 0),
    [sections]
  );

  // Check if the total added marks exceeds the total marks
  const marksExceeded = useMemo(() => singleExam?.marks && addedMarks >= singleExam.marks, [singleExam?.marks, addedMarks]);

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id && over?.id) {
        let swapedSectionIds: string[] = [];

        setSectionList((prevItems) => {
          const oldIndex = prevItems.findIndex((item) => item.id === active.id);
          const newIndex = prevItems.findIndex((item) => item.id === over.id);
          const swapedArray = arrayMove(prevItems, oldIndex, newIndex);

          swapedSectionIds = swapedArray.map((s) => String(s.id));

          return swapedArray;
        });

        dispatch(updateSectionSequence({ examId: String(examId), sequence: swapedSectionIds }));
      }
      setActiveId(null);
    },
    [dispatch, examId]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleAddSection = (type: any) => {
    setAddSubject(type);
  };

  const dragOverlayContent = useMemo(() => {
    if (!activeId) return null;
    const activeSection = sections.find((section) => section.id === activeId);
    const activeIndex = sections.findIndex((section) => section.id === activeId);

    return activeSection ? <DraggableCard row={activeSection} index={activeIndex} /> : null;
  }, [activeId, sections]);

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragCancel={handleDragCancel}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <SortableContext items={sectionIds} strategy={rectSortingStrategy}>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {sectionList.map((section, index) => (
              <MemoizedDraggableCard
                key={section.id}
                row={section}
                index={index}
                testDetails={testDetails}
                overallTotal={totalSectionScore}
                marks={singleExam?.marks}
                published={singleExam?.published}
              />
            ))}

            {/* Add Section Card */}
            {!singleExam?.published && !marksExceeded && AdminOnlyGroups.includes(user.role.role as Roles) && (
              <div className="relative flex w-full items-center justify-center rounded-lg border border-dashed bg-white/50 shadow-sm backdrop-blur-md sm:max-w-none">
                {/* Blurred Overlay */}
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-gray-300/30 backdrop-blur-sm">
                  <Button
                    onClick={() => handleAddSection(true)}
                    size="md"
                    variant="default"
                    color="primary"
                    data-testid="subject-btn"
                    className="z-20 flex min-w-[140px] items-center justify-center"
                  >
                    <Icon icon="si:add-fill" className="text-base text-white" />
                    {DialogTitle.ADD_SECTION}
                  </Button>
                </div>

                <div className="flex h-full w-full justify-between rounded-lg border bg-gray-100 p-3 shadow-sm">
                  <div className="mb-2 flex w-[30px]">
                    <div className="mr-3 h-7 w-5 bg-gray-300"></div>
                  </div>

                  <div className="ml-[-9px] w-full">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="h-4 w-2/3 rounded-md bg-gray-300"></div>
                      <div className="flex gap-2">
                        <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                        <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                      </div>
                    </div>
                    <div className="mb-4 h-4 w-1/2 rounded-md bg-gray-300"></div>
                    <div className="mb-4 h-4 w-1/2 rounded-md bg-gray-300"></div>
                    <div className="mb-3">
                      <div className="h-3 w-full rounded-md bg-gray-300"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <div className="h-7 w-7 rounded-full bg-gray-300"></div>
                        <div className="h-7 w-7 rounded-full bg-gray-300"></div>
                      </div>
                      <div className="flex gap-2">
                        {/* <div className="h-7 w-7 rounded-full bg-gray-300"></div> */}
                        <div className="h-7 w-7 rounded-full bg-gray-300"></div>
                        <div className="h-7 w-7 rounded-full bg-gray-300"></div>
                        <div className="h-7 w-7 rounded-full bg-gray-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SortableContext>

        {/* Drag Overlay */}
        <DragOverlay>{dragOverlayContent}</DragOverlay>
      </DndContext>
      {addSubject && (
        <SectionFormModal
          open={addSubject}
          row={sections}
          title={DialogTitle.ADD_SECTION}
          type={FormType.ADD}
          onClose={() => setAddSubject(false)}
          initialData={''}
          testDetails={testDetails}
          overallTotal={totalSectionScore}
          marks={singleExam?.marks}
        />
      )}
    </>
  );
};

export default SectionCards;
