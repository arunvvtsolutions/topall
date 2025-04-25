'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import SearchInput from '@/components/common/search-input';
import SelectDropdown from '@/components/common/Select';
import { LucideLoader } from '@/components/common/LucideLoader';
import { toast } from 'sonner';
import { TosterMessages } from '@/types/enum';
import { HttpStatus } from '@/types/constants';
import { GenericType } from '@/types';
import { Chapter1, Topic1, QuestionType, QuestionsProps } from '@/types/exams';
import QuestionCard from '../questions/question-card';
import {
  addQuestions,
  getChapterList,
  getQuestionModel,
  getSingleSection,
  getSingleTest,
  getTopicList,
  searchQuestion
} from '@/utils/api/exams';
import { useRouter } from 'next/navigation';

interface AddQuestionsProps {
  examId: number;
  sectionId: number;
}

const AddQuestions: React.FC<AddQuestionsProps> = ({ examId, sectionId }) => {
  const router = useRouter();
  const [subjectId, setSubjectId] = useState<number>(0);
  const [standardId, setStandardId] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResults, setSearchResults] = useState<QuestionsProps[]>([]);

  const [chaptersList, setChaptersList] = useState<GenericType[]>([{ id: 0, name: 'Select Chapter' }]);
  const [topicsList, setTopicsList] = useState<GenericType[]>([{ id: 0, name: 'Select Chapter First' }]);
  const [questionTypes, setQuestionTypes] = useState<GenericType[]>([{ id: 0, name: 'All Question Model' }]);
  const [difficultyList, setDifficultyList] = useState<GenericType[]>([{ id: 0, name: 'All Difficulty' }]);

  const [filters, setFilters] = useState({
    chapter: { id: 0, name: 'Select Chapter' },
    topic: { id: 0, name: 'Select Chapter First' },
    questionType: { id: 0, name: 'All Question Model' },
    difficulty: { id: 0, name: 'All Difficulty' }
  });

  const [questions, setQuestions] = useState<QuestionsProps[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [lastQuestionId, setLastQuestionId] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [questionTypeId, setQuestionTypeId] = useState(0);
  const LIMIT = 50;

  // Clear Filters Handler
  const clearFiltersHandler = useCallback(() => {
    setFilters({
      chapter: { id: 0, name: 'Select Chapter' },
      topic: { id: 0, name: 'Select Chapter First' },
      questionType: { id: 0, name: 'All Question Model' },
      difficulty: { id: 0, name: 'All Difficulty' }
    });
    setSearchValue('');
    setTopicsList([{ id: 0, name: 'Select Chapter First' }]);
    setQuestions([]);
    setSelectedQuestions([]);
    setLastQuestionId('');
    setHasSearched(false);
  }, []);

  // Search Handler
  const searchHandler = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSearching(true);

      if (!lastQuestionId || searchResults.length !== LIMIT) {
        setQuestions([]);
      }

      const searchFilters = {
        id: sectionId,
        standardId,
        subjectId,
        chapterId: filters.chapter.id,
        topicId: filters.topic.id,
        questionModelId: filters.questionType.id,
        difficultyId: filters.difficulty.id,
        limit: LIMIT,
        searchContent: searchValue,
        questionTypeId: questionTypeId || 0,
        lastQuestionId: lastQuestionId
      };

      try {
        const searchResult = await searchQuestion(searchFilters);
        if (searchResult.status === HttpStatus.NOT_FOUND) {
          toast.error(TosterMessages.ADMIN_QUESTIONS_NOT_LINKED);
          setLastQuestionId('');
          return;
        } else if (searchResult.status === HttpStatus.INTERNAL_SERVER_ERROR) {
          toast.error(TosterMessages.ADMIN_EXAM_COMMON_ERROR);
          setLastQuestionId('');
          router.push(`/admin/exams/${examId}/sections`);
          return;
        }
        setSearchResults(searchResult);

        setQuestions((prev) => (lastQuestionId ? [...prev, ...searchResult] : searchResult));

        if (searchResult.length === LIMIT) {
          setLastQuestionId(searchResult[searchResult.length - 1].questionId.toString());
        } else {
          setLastQuestionId('');
        }
      } catch (error) {
        console.error('Error searching questions:', error);
        toast.error(TosterMessages.ADMIN_QUESTION_SEARCH_FAIL);
      } finally {
        setIsSearching(false);
        setHasSearched(true);
      }
    },
    [filters, searchValue, questionTypeId, lastQuestionId, sectionId, standardId, subjectId]
  );

  // Question Selection Handler
  const questionSelectionHandler = useCallback(
    (questionId: number) => {
      setSelectedQuestions((prev) => {
        if (prev.includes(questionId)) {
          return prev.filter((id) => id !== questionId);
        } else if (prev.length < totalQuestions) {
          return [...prev, questionId];
        }
        return prev;
      });
    },
    [totalQuestions]
  );

  // Add Questions Handler
  const addQuestionHandler = useCallback(async () => {
    try {
      const response = await addQuestions({ id: examId, sectionId, questionsIds: selectedQuestions });
      if (response.status === HttpStatus.CONFLICT) {
        toast.error(TosterMessages.ADMIN_QUESTION_LIMIT_EXCEEDS);
      } else if (response.status !== HttpStatus.OK) {
        toast.error(TosterMessages.ADMIN_QUESTION_ADD_FAIL);
      } else {
        toast.success(TosterMessages.ADMIN_QUESTION_ADD_SUCCESS);
        setSelectedQuestions([]);
      }
    } catch (error) {
      console.error('Error adding questions:', error);
      toast.error(TosterMessages.SOMETHING_WENT_WRONG);
    } finally {
      router.push(`/admin/exams/${examId}/sections`);
    }
  }, [examId, sectionId, selectedQuestions]);

  // Chapter Filter Handler
  const chapterFilterHandler = async (chapter: GenericType) => {
    // Reset The Filters
    setFilters((prevFilters) => ({
      ...prevFilters,
      chapter,
      questionType: questionTypes.find((q) => q.name === 'All Question Model') || prevFilters.questionType,
      difficulty: difficultyList.find((d) => d.name === 'All Difficulty') || prevFilters.difficulty
    }));

    setTopicsList([{ id: 0, name: 'Select Topic' }]);

    if (chapter.id === 0) {
      setTopicsList([{ id: 0, name: 'Select Topic' }]);
      setFilters((prev) => ({
        ...prev,
        topic: { id: 0, name: 'Select Topic' }
      }));
      return;
    }

    try {
      setFilters((prev) => ({
        ...prev,
        topic: { id: 0, name: 'Select Topic' }
      }));

      const topics = await getTopicList({
        standardId,
        subjectId,
        chapterId: chapter.id
      });

      const convertedTopics = topics.map((topic: Topic1) => ({
        id: topic.topicId,
        name: topic.topicName
      }));

      convertedTopics.unshift({ id: 0, name: 'Select Topic' });

      setTopicsList(convertedTopics);
      setLastQuestionId('');
    } catch (error) {
      console.log(error);
    }
  };

  // Topic Filter Handler
  const topicFilterHandler = (topic: GenericType) => {
    setFilters((prev) => ({
      ...prev,
      topic
    }));
    setLastQuestionId('');
  };

  // Question Type Filter Handler
  const questionTypeFilterHandler = (questionType: GenericType) => {
    setFilters((prev) => ({
      ...prev,
      questionType
    }));
    setLastQuestionId('');
  };

  // Difficulty Filter Handler
  const difficultyFilterHandler = (difficulty: GenericType) => {
    setFilters((prev) => ({
      ...prev,
      difficulty
    }));
    setLastQuestionId('');
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [sectionData, testData] = await Promise.all([getSingleSection(examId, sectionId), getSingleTest(examId)]);
        setTotalQuestions(sectionData.totalQuestions - sectionData.questionList.length);
        setSubjectId(sectionData.subjectId);
        setStandardId(testData.standardId);
        setQuestionTypeId(sectionData.questionType);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error(TosterMessages.ADMIN_EXAM_COMMON_ERROR);
      }
    };

    fetchInitialData();
  }, [examId, sectionId]);

  useEffect(() => {
    const fetchFilters = async () => {
      if (!standardId || !subjectId) return;

      try {
        const [chapters, questionTypes] = await Promise.all([getChapterList({ standardId, subjectId }), getQuestionModel()]);

        const convertedChapters = [
          { id: 0, name: 'Select Chapter' },
          ...chapters.map((chapter: Chapter1) => ({ id: chapter.chapterId, name: chapter.chapterName }))
        ];

        const convertedTypes = [
          { id: 0, name: 'All Question Model' },
          ...questionTypes.map((type: QuestionType) => ({ id: type.typeId, name: type.typeName }))
        ];

        setChaptersList(convertedChapters);
        setQuestionTypes(convertedTypes);
      } catch (error) {
        console.error('Error fetching filters:', error);
        toast.error(TosterMessages.ADMIN_EXAM_COMMON_ERROR);
      }
    };
    setChaptersList([{ id: 0, name: 'Select Chapter' }]);
    setTopicsList([{ id: 0, name: 'Select Chapter First' }]);
    setQuestionTypes([{ id: 0, name: 'All Question Model' }]);
    setDifficultyList([
      { id: 0, name: 'All Difficulty' },
      { id: 1, name: 'Easy' },
      { id: 2, name: 'Medium' },
      { id: 3, name: 'Hard' }
    ]);
    fetchFilters();
  }, [standardId, subjectId]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex-grow space-y-6">
        <form onSubmit={searchHandler}>
          <div className="grid grid-cols-1 gap-x-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="chapter" className="text-[#222222]">
                Chapter
              </Label>
              <SelectDropdown
                width="w-full"
                name="chapter-dropdown"
                size="md"
                value={filters.chapter}
                data={chaptersList}
                onChange={chapterFilterHandler}
              />
            </div>

            <div className="sm:space-y-2">
              <Label htmlFor="topic" className="text-[#222222]">
                Topic
              </Label>
              <SelectDropdown
                width="w-full"
                name="topic-dropdown"
                size="md"
                value={filters.topic}
                data={topicsList}
                onChange={topicFilterHandler}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionModel" className="text-[#222222]">
                Question Model
              </Label>
              <SelectDropdown
                width="full"
                name="question-model-dropdown"
                size="md"
                data={questionTypes}
                onChange={questionTypeFilterHandler}
                value={filters.questionType}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-[#222222]">
                Difficulty
              </Label>
              <SelectDropdown
                width="w-full"
                name="difficulty-dropdown"
                size="md"
                data={difficultyList}
                value={filters.difficulty}
                onChange={difficultyFilterHandler}
                placeholder="Select Difficulty"
              />
            </div>
          </div>

          <div className="mt-2 space-y-2">
            <Label htmlFor="search" className="text-[#222222]">
              Search Questions (Enter Question without Math formula)
            </Label>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <SearchInput
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setLastQuestionId('');
                  }}
                  placeholder="Enter Question ID or Question without Math formula"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  data-test-id="add-questions-search-button"
                  disabled={isSearching}
                  size="md"
                  variant="default"
                  color="primary"
                  type="submit"
                >
                  Search
                </Button>
                <Button
                  data-test-id="add-questions-clear-button"
                  onClick={clearFiltersHandler}
                  size="md"
                  variant="default"
                  color="primary"
                  className="w-20"
                  type="button"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {!isSearching && hasSearched && questions.length === 0 && (
        <div className="flex h-full items-center justify-center p-6">No questions available</div>
      )}

      <div className="flex flex-col space-y-4">
        {questions &&
          questions.map((question, index) => (
            <QuestionCard
              key={question.questionId}
              questionId={question.questionId}
              index={index + 1}
              questionData={question}
              summaryTitle="Solution"
              isSelected={selectedQuestions.includes(question.questionId)}
              handleSelectQues={() => questionSelectionHandler(question.questionId)}
              maximumQuestionExceeds={selectedQuestions.length >= totalQuestions}
              showDelete={false}
            />
          ))}
        {!isSearching && questions.length > 0 && questions.length % LIMIT === 0 && (
          <div className="flex items-center justify-center">
            <Button
              data-test-id="add-questions-load-more-button"
              onClick={searchHandler}
              color="primary"
              variant="shadow"
              size="default"
            >
              Load More
            </Button>
          </div>
        )}
      </div>

      {isSearching && (
        <div className="flex h-full items-center justify-center p-6">
          <LucideLoader className="h-10 w-10 text-primary" />
        </div>
      )}

      {questions.length > 0 && (
        <div className="sticky bottom-4 space-y-6 pt-4">
          <div className="mx-auto flex items-center justify-between rounded-md border border-primary bg-primary px-4 py-2">
            <span className="text-sm font-medium text-white md:text-base">
              {selectedQuestions.length}/{totalQuestions} Question Selected
            </span>
            <Button
              data-test-id="add-questions-button"
              onClick={addQuestionHandler}
              size="md"
              variant="default"
              color="default"
              disabled={selectedQuestions.length === 0}
            >
              Add Questions
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddQuestions;
