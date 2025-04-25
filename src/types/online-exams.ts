import { GenericType } from '.';

export interface ExamStatus {
  start: boolean;
  resume: boolean;
  retake: boolean;
  testId: string;
}

interface ExamDetails {
  testId: string;
  name: string;
  allowResume: boolean;
  allowRetake: boolean;
  instantResult: boolean;
  showSyllabus: boolean;
  duration: number;
  userId: number;
  packageId: string;
  testTypeId: number;
  standardId: number;
  startTime: Date;
  endTime: Date;
  onlineInstrcutions: string;
  streamId: number;
  marks: number;
  published: boolean;
  totalQuestions: number;
  chapterId: number;
  chapterName: string;
  subjectId: number;
  level: GenericType;
  totalQuestion: number;
  totalMarks: number;
  totalTime: number;
}

export type SectionData = {
  sectionId: number;
  sectionName: string;
  subjectId: number;
  subjectName: string;
  maxAttempts: number;
  totalQuestions: number;
  questions: Question[];
  currentQuestion?: number;
};

export type Question = {
  questionId: number;
  subjectId: number;
  question: string;
  questionImage: string;
  questionType: number;
  correctOption: string;
  options: Option[];
  chapterId: number;
  topicId: number;
  difficulty: string;
};

export type Option = {
  optionId: string;
  option: string;
  optionImage: string;
};

export type QuestionType = {
  question: string;
  questionImag: string;
  questionId: number;
  options: Option[];
  questionType: number;
};

export interface OnlineExaminationState {
  hasError: string | null;
  examStatus: ExamStatus[];
  examDetails: ExamDetails | null;
  sectionsData: SectionData[];
  hasExamError: string | null;
  selectedSubject: GenericType | null;
  currentSection: string;
  currentQuestion: string;
  attemptedQuestions: AttemptedQuestion[];
  // remainingTime: number;
  // timeSpent: number;
}

export type AttemptedQuestion = {
  questionId: number;
  ans: string;
  mark_for_review: number;
  time_taken: number;
  bookmark: boolean;
};

export type CurrentAttempt = {
  question_id: string;
  selected_option: string;
  time_spent: number;
  is_answered: boolean;
  is_answered_and_marked_for_review: boolean;
  is_marked_for_review: boolean;
  is_visited: boolean;
};

export enum OnlineExamination {
  ANSWERED = 'Answered',
  NOT_ANWERED = 'Not Answered',
  MARK_FOR_REVIEW = 'Mark for Review',
  SECTIONS = 'Sections',
  QUESTION = 'Question',
  GENERAL_QUESTION = 'General instructions',
  SAVE_AND_MARK_FOR_REVIEW = 'Save and Mark for Review',
  NOTE = 'Note',
  NOTE_CONTENT = 'The test will be automatically submitted and moved to the result page when the time ends.',
  INSTRUCTION = 'instruction',
  EXAM = 'exam',
  MAX_ATTEMPT_WARNING = 'Dear Aspirant, as per the new :examName pattern,you can attempt any :limit out of :maxQst questions from this Section. To attempt this question,please remove your answer from any one of the :limit previously attempted questions.',
  NO_QST_FOUND = 'No Question found on this section',
  OE_TEST_DETAILS = 'oeTestDetails',
  RESUME_TEST = 'resumeTest',
  START_TEST = 'startTest',
  RETAKE_TEST = 'retakeTest',
  EXAM_ALREADY_SUBMITTED = 'Exam Already submitted',
  SOMETHING_WENT_WRONG = 'Something went wrong',
  EXAM_SUBMITTED_SUCCESSFULLY = 'Exam Submitted',
  EXAM_SUBMITTED_SUCCESSFULLY_DESC = 'You have successfully Submitted the exam',
  ENTER_YOUR_ANS = 'Enter your answer here',
  CLEAR_ALL = 'Clear All',
  BACK_SPACE = 'Backspace',
  START_TEST_REFRESH_MSG = "If the 'Start Test' button doesn't appear on time, please click here the refresh button"
}

export enum ExamSecBtnType {
  CURRENT_QST = 'currentQst',
  ANSWERED = 'is_answered',
  NOT_ANWERED = 'notAnwered',
  MARK_FOR_REVIEW = 'is_marked_for_review',
  ANSWERED_AND_MARK_FOR_REVIEW = 'is_answered_and_marked_for_review',
  VISITED = 'is_visited',
  NOT_VISITED = 'not_visited'
}
