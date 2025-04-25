import { GenericType } from '.';

export type adminExamsStateProps = {
  error: any;
  loading: boolean;
  examsList: ExamsProps | null;
  examFilters: FilterExamPayload;
  reportTypes: { id: number; report_type: string }[];
};

export type GetExamPayload = {
  limit: number;
  page: number;
  search?: string;
};

export type FilterExamPayload = {
  publishType: number[];
  streamIds: number[];
  testTypeIds: number[];
  standardIds: number[];
};

export type ExamsProps = {
  totalPages: number;
  prevCursor: string;
  nextCursor: string;
  nextPageResult: boolean;
  prevPageResult: boolean;
  totalExamCount: number;
  examList: ExamList[];
};

export type ExamList = {
  id: string;
  name: string;
  showSyllabus: boolean;
  allowRetake: boolean;
  allowResume: boolean;
  duration: number;
  pin: null | string;
  scheduledAt: string;
  resultAt: string;
  restrictAt: string;
  onlineInstructions: null;
  kind: string;
  published: boolean;
  createdById: number;
  totalMarks: number;
  totalQuestionCount: number;
  currentAddedQuestionCount: number;
  streams: GenericType;
  testTypes: GenericType;
  standard: GenericType;
  packages: GenericType[];
  faculties: Faculty[];
  reusedQuestionCount: number;
};

export type Faculty = {
  id: number;
  name: string;
  image_url: string;
  assignedSectionId: number;
  assignedSectionName: string;
};

export type QuestionsProps = {
  questionId: number;
  chapterName: string;
  conceptName: string;
  question: string;
  questionImage: string;
  option1: string;
  option1Image: string;
  option2: string;
  option2Image: string;
  option3: string;
  option3Image: string;
  option4: string;
  option4Image: string;
  explanation: string;
  explanationImage?: string;
  correctOption: string;
  difficulty: string | number;
  questionType: number;
  selectedOption: string;
  timeSpent: number;
  paceTag: string;
  status: string;
  correctByPercentage: number;
  solution?: string;
  solutionImage?: string;
  usageHistory?: boolean;
  correctAttempt?: null | string;
  attemptBy?: null | string;
  previousYearName?: null | string;
  qCardType?: string | number;
};

export type AnswerKey = {
  sectionId: number;
  sectionName: string;
  subjectDetails: GenericType;
  questions: QuestionsProps[];
}

export type Topic1 = {
  topicId: number;
  topicName: string;
};

export type QuestionType = {
  typeId: number;
  typeName: string;
};

export type Chapter1 = {
  chapterId: number;
  chapterName: string;
};

export type UsageHistoryProps = {
  id: string;
  name: string;
  scheduledAt: string;
};

export type GetUsageHistory = {
  tests: UsageHistoryProps[];
};
export interface Topic {
  id: number;
  name: string;
  topicQuesCount: number;
}

export interface Chapter {
  chapterId: number;
  chapterName: string;
  chapterWiseTopicQuesCount: number;
  topics: Topic[];
}

export interface Syllabus {
  subjectId: number;
  subjectName: string;
  totalQuestionsCount: number;
  topicsAndChapters: Chapter[];
}
export interface Section {
  title: string;
  marks: number;
  correct: number;
  wrong: number;
  left: number;
  accuracy: string;
}

export type GeneateTestSyllabusProps = {
  subjectId: number;
  subjectName: string;
  chapterIds: number[];
};

export type GenerateTestProps = {
  testName: string;
  studentId: number;
  streamId: number;
  standardId: number;
  cwlMarks: number[];
  difficulty: number[];
  questionPerSubject: number;
  minutesPerSubject: number;
  questionTypes: string[];
  syllabus: GeneateTestSyllabusProps[];
};
