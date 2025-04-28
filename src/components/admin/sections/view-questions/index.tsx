'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { QuestionsProps } from '@/types/exams';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Checkbox } from '@/components/ui/checkbox';
import { deleteQuestions, getSingleTest, getViewQuestions, updateQuestionsOrder } from '@/utils/api/exams';
import { toast } from 'sonner';
import { LucideLoader } from '@/components/common/LucideLoader';

import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';
import { TosterMessages } from '@/types/enum';
import DeleteConfirmationModal from '@/components/delete-confirmation-dialog';
import { HttpStatus } from '@/types/constants';
import UsageHistoryModal from './usage-history';
import ReportFeedback from '../questions/reportcard';
import { useDispatch } from '@/store';
import { getReportTypes } from '@/store/slice/admin/exams';
const QuestionCard = dynamic(() => import('../questions/question-card'), { ssr: false });

const ViewQuestions = ({ examId, sectionId }: { examId: string; sectionId: string }) => {
  const dispatch = useDispatch();
  const [questions, setQuestions] = useState<QuestionsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [questionId, setQuestionId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showUsageHistoryModal, setShowUsageHistoryModal] = useState<boolean>(false);
  const [showReportFeedbackModal, setShowReportFeedbackModal] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<any>(null);
  const [singleExam, setSingleExam] = useState<any>(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const questionIds = useMemo(() => questions.map((item) => item.questionId), [questions]);

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const ques = await getViewQuestions(sectionId);
        setQuestions(ques);
        dispatch(getReportTypes());
      } catch (error) {
        toast.error(TosterMessages.ADMIN_QUESTIONS_GET_FAILED);
      } finally {
        setLoading(false);
      }
    };
    getQuestions();
  }, [sectionId]);

  // Fetch singleExam details
  useEffect(() => {
    const fetchSingleExam = async () => {
      try {
        const response = await getSingleTest(Number(examId));
        setSingleExam(response);
      } catch (error) {
        console.error('Error fetching test details:', error);
        toast.error('Failed to fetch test details.');
      }
    };

    fetchSingleExam();
  }, [examId]);
  
  //selected all questions
  const handleSelectAllQuestions = () => {
    if (selectedQuestions.length === questions.length) {
      setSelectedQuestions([]);
    } else {
      const allQuestionIds = questions.map((ques) => ques.questionId);
      setSelectedQuestions(allQuestionIds);
    }
  };

  // selected questions
  const handleSelectQuestions = (quesId: number) => {
    if (selectedQuestions.includes(quesId)) {
      const updatedSelection = selectedQuestions.filter((id) => id !== quesId);
      setSelectedQuestions(updatedSelection);
    } else {
      setSelectedQuestions((prev) => [...prev, quesId]);
    }
  };

  //handle start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  //dragEndHandler
  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = questions.findIndex((q) => q.questionId === active.id);
    const newIndex = questions.findIndex((q) => q.questionId === over.id);
    // Create a new array with the updated order
    const newQuestions = arrayMove([...questions], oldIndex, newIndex);
    setQuestions(newQuestions);
    try {
      const payload = { sectionId: Number(sectionId), questionIds: newQuestions.map((q) => q.questionId) };
      const updatedQuesRes = await updateQuestionsOrder(payload);
      if (updatedQuesRes && updatedQuesRes?.status === HttpStatus.OK) {
        toast.success(TosterMessages.ADMIN_QUESTIONS_UPDATE_SUCCESS);
      } else {
        setQuestions(questions);
        toast.error(TosterMessages.ADMIN_QUESTIONS_UPDATE_FAILED);
      }
      setActiveId(null);
    } catch (error) {
      setQuestions(questions);
      toast.error(TosterMessages.SOMETHING_WENT_WRONG);
    }
  };

  //dragCancelHandler
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  //delete questions
  const handleDeleteQuestions = useCallback(async () => {
    try {
      const qIds = questionId ? [questionId] : selectedQuestions;
      const payload = { sectionId: Number(sectionId), questionIds: qIds };

      const deletedQuesRes = await deleteQuestions(payload);
      if (deletedQuesRes && deletedQuesRes?.status === HttpStatus.OK) {
        toast.success(TosterMessages.ADMIN_QUESTIONS_DELETE_SUCCESS);
        setQuestions(questions.filter((q) => !qIds.includes(q.questionId)));
        setSelectedQuestions(selectedQuestions.filter((id) => !qIds.includes(id)));
      } else {
        toast.error(TosterMessages.ADMIN_QUESTIONS_DELETE_FAILED);
      }
    } catch (error) {
      toast.error(TosterMessages.SOMETHING_WENT_WRONG);
    } finally {
      setShowDeleteModal(false);
      setQuestionId(null);
    }
  }, [sectionId, questionId, selectedQuestions]);

  //show delete modal
  const handleShowDeleteModal = useCallback((id: number) => {
    setShowDeleteModal(true);
    setQuestionId(id);
  }, []);

  //show usage history
  const handleShowUsageHistoryModal = useCallback((id: number) => {
    setShowUsageHistoryModal(true);
    setQuestionId(id);
  }, []);

  //show report feedback
  const handleShowReportModal = useCallback((id: number) => {
    setShowReportFeedbackModal(true);
    setQuestionId(id);
  }, []);

  //loading here
  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <LucideLoader className="h-8 w-8 text-primary" />
      </div>
    );
  }

  //no data here
  if (questions?.length === 0) {
    return <div className="text-center">No questions are available</div>;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="item-center flex h-14 justify-between rounded-md border border-primary bg-primary/5 p-2">
          <div className={`flex items-center space-x-2 ${singleExam?.published ? 'pointer-events-none opacity-50' : ''}`}>
            <Checkbox
              id="select-all"
              checked={selectedQuestions.length === questions.length}
              onCheckedChange={handleSelectAllQuestions}
              color="primary"
            />
            <label htmlFor="select-all" className="text-sm font-medium text-primary md:text-base">
              Select All
            </label>
          </div>
          {selectedQuestions.length > 0 && (
            <div>
              <Button
                disabled={singleExam?.published}
                variant="default"
                size="md"
                className="border border-borderad text-xs font-bold text-ButtonC hover:bg-ButtonC/5"
                data-test-id="delete-questions"
                onClick={() => setShowDeleteModal(true)}
              >
                <Icon icon={'mdi:trash-can-outline'} className="text-base text-destructive md:mr-2" />
                <p className="hidden text-inherit sm:block">Delete Questions</p>
              </Button>
            </div>
          )}
        </div>
        <DndContext
          sensors={sensors}
          modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={questionIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {questions.map((question: QuestionsProps, index: number) => (
                <QuestionCard
                  key={question.questionId}
                  index={index + 1}
                  published={singleExam?.published}
                  questionId={question.questionId}
                  questionData={question}
                  summaryTitle="Solution"
                  isSelected={selectedQuestions.includes(question.questionId)}
                  handleSelectQues={handleSelectQuestions}
                  onShowDelete={handleShowDeleteModal}
                  onShowUsageHistory={handleShowUsageHistoryModal}
                  onReportFeedback={handleShowReportModal}
                  showDraggable
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <QuestionCard
                questionId={activeId}
                index={questions.findIndex((q) => q.questionId === activeId) + 1}
                questionData={questions.find((q) => q.questionId === activeId) as QuestionsProps}
                isDragged
                showDraggable
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          open={showDeleteModal}
          message={'Are you sure you want to delete this question?'}
          onClose={() => {
            setShowDeleteModal(false);
            setQuestionId(null);
          }}
          onConfirm={handleDeleteQuestions}
        />
      )}

      {/* Usage History Modal */}
      {showUsageHistoryModal && (
        <UsageHistoryModal
          questionId={questionId}
          isOpen={showUsageHistoryModal}
          onClose={() => {
            setShowUsageHistoryModal(false);
            setQuestionId(null);
          }}
        />
      )}

      {/* Report Modal */}
      {showReportFeedbackModal && (
        <ReportFeedback
          questionId={questionId}
          isOpen={showReportFeedbackModal}
          onClose={() => setShowReportFeedbackModal(false)}
        />
      )}
    </>
  );
};

export default ViewQuestions;
