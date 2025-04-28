import React, { useCallback, useEffect, useState } from 'react';
import { MainDialog } from '@/components/common/MainDialog';
import SelectDropdown from '@/components/common/Select';
import { GenericType, SyllabusChapters } from '@/types';
import { useDispatch, useSelector } from '@/store';
import { getQBSubjects } from '@/store/slice/admin/selectors';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { SyllabusProps } from './index';
import { getSyllabusChapters, updateSyllabusChapters } from '@/utils/api/academic';
import ChaptersList from './chapters-list';
import { toast } from 'sonner';
import { HttpStatus } from '@/types/constants';
import { FormType } from '@/types/enum';
import { LucideLoader } from '@/components/common/LucideLoader';
import { getSyllabusLink } from '@/store/slice/admin/academic';

interface ChapterTopicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSyllabus: SyllabusProps | null;
}

const ChaptersTopicsModal = ({ isOpen, onClose, selectedSyllabus }: ChapterTopicsModalProps) => {
  const dispatch = useDispatch();
  const { qbSubjects } = useSelector((state) => state.selectors);
  const [selectedQbSubjects, setSelectedQbSubjects] = useState<GenericType | null>(null);
  const [chapters, setChapters] = useState<SyllabusChapters[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Check if all chapters are initially selected
  const allSelected = chapters.every((chapter) => chapter.topics.every((topic) => topic.checked));

  const handleSubjectChange = (subject: GenericType | null) => {
    setSelectedQbSubjects(subject);
  };

  // Check if chapter is fully selected
  const isChapterSelected = useCallback(
    (chapterId: number): boolean => {
      const chapter = chapters?.find((c) => c.chapterId === chapterId);
      return chapter?.topics.every((t) => t.checked) ?? false;
    },
    [chapters]
  );

  // Toggle all chapters
  const toggleSelectAll = useCallback(() => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setChapters((prev) =>
      prev.map((chapter) => ({
        ...chapter,
        topics: chapter.topics.map((topic) => ({
          ...topic,
          checked: newSelectAll
        }))
      }))
    );
  }, [selectAll]);

  // Toggle all topics in a chapter
  const toggleChapter = useCallback((chapterId: number, checked: boolean) => {
    setChapters((prev) =>
      prev.map((chapter) => {
        if (chapter.chapterId === chapterId) {
          return {
            ...chapter,
            topics: chapter.topics.map((topic) => ({
              ...topic,
              checked: checked
            }))
          };
        }
        return chapter;
      })
    );
  }, []);

  // Toggle individual topic
  const toggleTopic = useCallback((chapterId: number, topicId: number) => {
    setChapters((prev) =>
      prev.map((chapter) => {
        if (chapter.chapterId === chapterId) {
          return {
            ...chapter,
            topics: chapter.topics.map((topic) => {
              if (topic.topicId === topicId) {
                return { ...topic, checked: !topic.checked };
              }
              return topic;
            })
          };
        }
        return chapter;
      })
    );
  }, []);

  //clear chapter
  const clearChapter = useCallback((chapterId: number) => {
    setChapters((prevChapters) =>
      prevChapters.map((chapter) =>
        chapter.chapterId === chapterId
          ? { ...chapter, topics: chapter.topics.map((topic) => ({ ...topic, checked: false })) }
          : chapter
      )
    );
  }, []);

  //handle the update chapters
  const handleUpdateChapters = async () => {
    if (!selectedSyllabus || !selectedQbSubjects) {
      toast.error('Please select a syllabus and question bank subject');
      return;
    }
    setIsUpdating(true);
    try {
      const payload = {
        courseSubjectId: selectedSyllabus.subjects.id,
        standardId: selectedSyllabus.standard.id,
        qBankSubjectId: selectedQbSubjects.id,
        syllabus: chapters
      };
      const updateChapterRes = await updateSyllabusChapters(payload);
      if (updateChapterRes?.status === HttpStatus.OK) {
        onClose();
        dispatch(getSyllabusLink());
        toast.success('Chapters updated successfully');
      } else {
        throw new Error('Failed to update chapters');
      }
    } catch (error) {
      console.error('Error updating chapters:', error);
      toast.error('Failed to update chapters');
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const fetchQBSubjects = () => {
      dispatch(getQBSubjects());
    };
    fetchQBSubjects();
  }, []);

  useEffect(() => {
    if (selectedSyllabus && selectedQbSubjects) {
      const fetchChapters = async () => {
        setIsLoading(true);
        setSelectAll(false);
        try {
          const response = await getSyllabusChapters(
            selectedSyllabus.subjects.id,
            selectedSyllabus.standard.id,
            selectedQbSubjects.id
          );
          const fetchedChapters = response?.syllabus || [];
          setChapters(fetchedChapters);
        } catch (error) {
          console.error('Error fetching chapters:', error);
          toast.error('Failed to fetch chapters');
        } finally {
          setIsLoading(false);
        }
      };

      fetchChapters();
    }
  }, [selectedSyllabus, selectedQbSubjects]);

  return (
    <MainDialog title={'Chapter & Topic List'} isOpen={isOpen} onOpenChange={onClose} size="md">
      <div>
        <SelectDropdown
          data={qbSubjects}
          value={selectedQbSubjects}
          onChange={handleSubjectChange}
          placeholder="Select Question Bank Subjects"
          name="qb-subjects"
          width="w-[100%]"
          size="md"
        />
      </div>

      {/* Chapters and topics list */}

      {chapters.length > 0 ? (
        <div className="mt-4 flex flex-col">
          {!isLoading && (
            <div className="flex justify-end">
              <div className="flex items-center space-x-2">
                <Checkbox id="select-all" checked={selectAll || allSelected} onCheckedChange={toggleSelectAll} color="primary" />
                <label htmlFor="select-all" className="text-sm text-primary">
                  Select All Chapters
                </label>
              </div>
            </div>
          )}

          <div className="mt-4">
            <ChaptersList
              chapters={chapters}
              isChapterSelected={isChapterSelected}
              toggleChapter={toggleChapter}
              toggleTopic={toggleTopic}
              clearChapter={clearChapter}
              isLoading={isLoading}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              type="submit"
              size="md"
              variant="default"
              color="primary"
              className="gap-1 !px-10"
              data-testid="chapter-update"
              onClick={handleUpdateChapters}
              disabled={isUpdating}
            >
              {isUpdating && <LucideLoader />}
              {FormType.UPDATE}
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </MainDialog>
  );
};

export default ChaptersTopicsModal;
