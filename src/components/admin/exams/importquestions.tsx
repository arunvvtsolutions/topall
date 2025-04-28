'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GenericType } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { getQuestionList, getSingleTest, getTestList } from '@/utils/api/examination';
import { QuestionsProps } from '@/types/exams';
import QuestionCard from '../sections/questions/question-card';
import { addQuestionList, getSinglesectionTest } from '@/utils/api/exams';
import { HttpStatus } from '@/types/constants';
import { toast } from 'sonner';
import { TosterMessages } from '@/types/enum';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import SelectDropdown from '@/components/common/SelectSecondary';
import FeedbackForm from '../sections/questions/reportcard';
import moment from 'moment';

// Define the Test type with required fields
interface Test {
  testId: number;
  name: string;
  streamId: number;
  streamName: string;
  scheduledDate: string;
  sections: string[];
  standardId: number;
}

// Define the props expected for this component
interface ImportQuestionsProps {
  examId: number;
  sectionId: number;
}

const ImportQuestions: React.FC<ImportQuestionsProps> = ({ examId, sectionId }) => {
  // State variables to manage selection and data
  const [selectedValues, setSelectedValues] = useState<{
    totalQuestions: number;
    selectedSubjectId: number | null;
    selectedTestId: number | null;
    selectedQutiontypeId: number | null;
    selectedStreamId: number | null;
  }>({
    totalQuestions: 0,
    selectedSubjectId: null,
    selectedTestId: null,
    selectedQutiontypeId: null,
    selectedStreamId: null
  });

  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [questions, setQuestions] = useState<QuestionsProps[]>([]);
  const [selectedDropdown, setSelectedDropdwon] = useState<GenericType | null>(null);
  const [testData, setTestData] = useState<Test[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [questionId, setQuestionId] = useState<number | null>(null);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [showReportFeedbackModal, setShowReportFeedbackModal] = useState<boolean>(false);
  const router = useRouter();

  // Callback to handle question selection or deselection
  const handleSelectQuestions = useCallback(
    (questionId: number) => {
      setSelectedQuestions((prev) => {
        if (prev.includes(questionId)) {
          return prev.filter((id) => id !== questionId); // Remove question if already selected
        } else if (prev.length < selectedValues.totalQuestions) {
          return [...prev, questionId]; // Add question if not yet selected and within limit
        }
        return prev;
      });
    },
    [selectedValues.totalQuestions]
  );

  // Reset all selected values and data
  const clearHandler = async () => {
    setSelectedDropdwon(null);
    setFilteredData([]);
    setDate(undefined);
    setSelectedQuestions([]);
    setQuestions([]);
    try {
      await fetchTestData();
    } catch (error) {
      console.log('error', error);
    }
  };

  // Handle date selection from the calendar
  const dateHandler = async (selectedDate: Date | undefined) => {
     if (!selectedDate) return; // Avoid errors if no date is selected
    setDate(selectedDate);

    if (selectedDate) {
      // Convert the selectedDate to Moment.js object
      const momentSelectedDate = moment(selectedDate);

      const selectedTestList = testData.filter((test) => {
          // Convert scheduledDate to Moment.js object, assuming scheduledDate is in 'DD/MM/YYYY' format
          const momentTestDate = moment(test.scheduledDate, 'DD/MM/YYYY');

          // Compare the two dates
          return momentTestDate.isSame(momentSelectedDate, 'day'); // Check if both dates are the same day
        })
        .map((test) => ({
          ...test,
          id: test.testId
        }));

      if (selectedTestList.length === 0) {
        // No tests available for the selected date
        setSelectedDropdwon(null);
        setQuestions([]);
        setFilteredData([]);
      } else {
        setFilteredData(selectedTestList);
      }
    } else {
      setFilteredData([]); // Clear test data if no date is selected
    }
  };
  // Fetch exam and section data
  useEffect(() => {
    const getData = async () => {
      try {
        const [sectionResponse, testResponse] = await Promise.all([
          getSinglesectionTest(examId, sectionId),
          getSingleTest(examId)
        ]);

        if (sectionResponse && testResponse) {
          setSelectedValues((prev) => ({
            ...prev,
            totalQuestions: sectionResponse.totalQuestions,
            selectedSubjectId: sectionResponse.subjectId,
            selectedStreamId: testResponse.streamId,
            selectedQutiontypeId: sectionResponse.questionType
          }));
          setSelectedQuestions(sectionResponse.questionList);
        } else {
          toast.error('Error fetching section or test data.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching data.');
      }
    };
    getData();
  }, [examId, sectionId]);

  const fetchTestData = async () => {
    if (!selectedValues.selectedSubjectId) return;
    try {
      const response = await getTestList(selectedValues.selectedSubjectId);

      if (response.length === 0) {
        toast.error('No tests found.');
        return;
      }
      const filteredResponse = response.filter((item: any) => item.testId !== String(examId));
      setTestData(filteredResponse);
      const dropDownData = filteredResponse.map((item: any) => ({
        id: item.testId,
        name: item.name + ' - ' + item.streamName
      }));
      setFilteredData(dropDownData);
    } catch (error) {
      console.error('Failed to fetch test data:', error);
      toast.error('Failed to fetch test data.');
    }
  };
  // Fetch the list of tests based on selected subject
  useEffect(() => {
    fetchTestData();
  }, [examId, selectedValues.selectedSubjectId]);

  const handleChange = (value: GenericType | null): void => {
    if (value && (!selectedDropdown || value.id !== selectedDropdown.id)) {
      setSelectedDropdwon(value);
    }
  };

  // useEffect to perform actions when selectedDropdown changes
  useEffect(() => {
    if (!selectedDropdown) return;

    // Find the selected test based on selectedDropdown
    const selectedTest = testData.find((test) => test.testId === selectedDropdown.id);

    if (selectedTest) {
      // Update selectedTestId in selectedValues state
      setSelectedValues((prev) => ({
        ...prev,
        selectedTestId: selectedTest.testId
      }));
    }
  }, [selectedDropdown, testData]);

  // Search handler to fetch the questions based on selected values
  const searchHandler = async () => {
    const { selectedSubjectId, selectedTestId, selectedQutiontypeId, selectedStreamId } = selectedValues;

    if (!selectedDropdown) {
      toast.error('Please select a test to continue.');
      return;
    }

    setLoading(true);
    setHasSearched(true); // Mark as searched
    try {
      const response = await getQuestionList(examId, selectedSubjectId, selectedTestId, selectedQutiontypeId, selectedStreamId);

      if (response.length === 0) {
        setQuestions([]); // Set questions to an empty array if no data is found
        toast.error('No questions found for the selected filters.');
      } else {
        setQuestions(response); // Set the fetched questions
      }
    } catch (error) {
      console.log('Error fetching filtered test data:', error);
      toast.error('Error fetching questions.');
    } finally {
      setLoading(false);
    }
  };

  // Handler to import selected questions into the exam section
  const importQuestionHandler = useCallback(async () => {
    if (selectedQuestions.length === 0) {
      toast.error(TosterMessages.SELECT_QUESTIONS);
      return;
    }

    const questionData = {
      questionsIds: selectedQuestions,
      sectionId: sectionId,
      id: examId
    };

    try {
      const response = await addQuestionList(questionData);

      // Handle specific HTTP status codes for different scenarios
      if (response.status === HttpStatus.CONFLICT) {
        toast.error(TosterMessages.ADMIN_IMPORT_FAIL_LIMT);
      } else if (response.status !== HttpStatus.OK) {
        toast.error(TosterMessages.ADMIN_IMPORT_FAIL);
      } else {
        toast.success(TosterMessages.ADMIN_QUESTION_IMPORT_SUCCESS);
        setSelectedQuestions([]); // Clear selected questions only after success
      }
    } catch (error) {
      console.error('Error adding questions:', error);
      toast.error(TosterMessages.SOMETHING_WENT_WRONG);
    } finally {
      router.push(`/admin/exams/${examId}/sections`);
    }
  }, [examId, sectionId, selectedQuestions]);
  //show report feedback
  const handleShowReportModal = useCallback((id: number) => {
    setShowReportFeedbackModal(true);
    setQuestionId(id);
  }, []);
  return (
    <div className="flex min-h-[80vh] flex-col p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        {/* Date Field: For selecting an optional date */}
        <div className="space-y-2 sm:w-[300px] md:w-[350px]">
          <Label className="text-xs font-semibold text-B2CAgrayn sm:text-sm">Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'flex h-10 w-full text-left text-xs font-medium',
                  !date && 'text-muted-foreground', // Muted style when no date is selected
                  'rounded border border-gray-300 bg-white text-primary'
                )}
              >
                {date ? format(date, 'PPP') : <span className="flex-1">DD-MM-YY</span>} {/* Show placeholder if no date */}
                <Icon icon="solar:calendar-linear" className="ml-auto h-4 w-4 text-[#4B4B4B]" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={dateHandler} />
            </PopoverContent>
          </Popover>
        </div>

        {/* Test Name Field: Select the test for the section */}
        <div className="space-y-2 sm:w-[300px] md:w-[350px]">
          <Label className="text-xs font-semibold text-B2CAgrayn sm:text-sm">
            Test Name<span className="text-red-500">*</span>
          </Label>
          <div className="mt-8 flex flex-col space-y-4">
            <SelectDropdown
              value={selectedDropdown}
              placeholder="Select Test Name"
              data={
                filteredData.length === 0
                  ? [{ id: 0, name: 'No Test Available' }]
                  : [{ id: 0, name: 'Select Test Name' }, ...filteredData]
              }
              onChange={handleChange}
              name="test-name"
              width="h-10 w-full"
              size="default"
              // disabled={filteredData.length === 0} // Disable the dropdown if no data
            />
          </div>
        </div>

        {/* Action Buttons: Buttons for Searching and Clearing */}
        <div className="mt-4 flex flex-row gap-4 sm:mt-8 sm:flex-row">
          <Button
            onClick={searchHandler}
            className="h-10 w-full bg-[#0D068E] px-8 text-sm font-medium text-white hover:bg-[#0D068E]/90 sm:w-auto"
            disabled={loading}
          >
            {loading ? 'Search' : 'Search'}
          </Button>
          <Button
            onClick={clearHandler}
            className="h-10 w-full bg-[#0D068E] px-8 text-sm font-medium text-white hover:bg-[#0D068E]/90 sm:w-auto"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Question List: Render list of questions */}
      <div className="mt-8 flex flex-col space-y-4">
        {hasSearched && questions.length === 0 ? (
          <div className="mr-20 mt-16 text-center text-lg text-black">No Questions Found</div>
        ) : (
          questions.map((question: QuestionsProps, index: number) => (
            <QuestionCard
              key={question.questionId}
              questionId={question.questionId}
              index={index + 1}
              questionData={question}
              summaryTitle="Solution"
              onReportFeedback={handleShowReportModal}
              isSelected={selectedQuestions.includes(question.questionId)}
              handleSelectQues={() => handleSelectQuestions(question.questionId)}
              maximumQuestionExceeds={selectedQuestions.length >= selectedValues.totalQuestions}
            />
          ))
        )}
      </div>

      {/* Action to import selected questions */}
      {questions.length > 0 && (
        <div className="sticky bottom-4 space-y-6 pt-4">
          <div className="mx-auto flex items-center justify-between rounded-md border border-primary bg-primary px-4 py-2">
            <span className="text-sm text-muted-foreground text-white">
              {selectedQuestions.length}/{selectedValues.totalQuestions} Question Selected
            </span>
            <Button
              data-test-id="import-questions-button"
              onClick={importQuestionHandler}
              size="md"
              variant="outline"
              color="primary"
              className="bg-white hover:bg-white hover:text-primary"
              disabled={selectedQuestions.length === 0}
            >
              Import Questions
            </Button>
          </div>
        </div>
      )}

      {showReportFeedbackModal && (
        <FeedbackForm
          questionId={questionId}
          isOpen={showReportFeedbackModal}
          onClose={() => setShowReportFeedbackModal(false)}
        />
      )}
    </div>
  );
};

export default ImportQuestions;
