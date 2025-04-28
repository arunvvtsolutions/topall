import { adminExamsStateProps } from './exams';
import { OnlineExaminationState } from './online-exams';
import { ChapterConceptAnalysis, DifficultyAnalysis, SubjectWiseAnalysis, WeakerAreaAnalysis } from './user/overall-analysis';
import { IExamAttempts, ProfileExam, UserProfileType } from './user';

export interface DefaultRootStateProps {
  adminAcademic: adminAcademicStateProps;
  selectors: adminSelectorsStateProps;
  adminExams: adminExamsStateProps;
  autendication: { error: any; user: string; role: string };
  user: studentStateProps;
  stream: studentStreamProps;
  userProfile: UserProfileType;
  onlineExamination: OnlineExaminationState;
  overAllResult: OverAllResultProps;
  overAllAnalysis: overAllAnalysisProps;
  bookmarks: BookmarksProps;
  ranking: RankingProps;
  testType: TestTypeProps;
  packages: PackagePlanProps;
  userPackagePlan: UserPackagePlan;
}

type PackagePlanProps = {
  error: any;
  packages: PackagePlanData[];
  chapterData: ChapterData[];
};

interface UserPackagePlan {
  error: any;
  packagePlan: Packages[];
}

export interface Packages {
  id: number;
  name: string;
  description: string[];
  subscriptions: Subscription[];
}

export interface Subscription {
  id: number;
  name: string;
  standard: string;
  stream: number;
  packagePlanId: number;
  subscriptionAmountData: SubscriptionAmountDatum[];
}

export interface SubscriptionAmountDatum {
  id: number;
  actual_price: number;
  discount_price: number;
  is_gst_include: boolean;
  subscription_id: number;
  duration_type: DurationType;
}

export interface DurationType {
  id: number;
  name: string;
  short_name: string;
}

interface ChapterData {
  id: number;
  name: string;
  chapters: GenericType[];
}

interface PackagePlan {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  standardList: GenericType[];
}

interface PackagePlanData {
  streamId: number;
  streamName: string;
  packagePlans: PackagePlan[];
}

type RankingProps = {
  error: any;
  questionwise: Ranking[] | null;
  timewise: Ranking[] | null;
  referralwise: Ranking[] | null;
  regionalwise: Ranking[] | null;
};

export type Ranking = {
  currentUser: {
    total?: number | string;
    rank?: number | string;
  };
  type: string;
  ranks: {
    name?: string;
    image_url?: string;
    total?: number | string;
  }[];
};

type TestTypeProps = {
  error: any;
  testTypes: TestTypes[];
};

type TestTypes = {
  error: any;
  id: number;
  description: string;
  image_file: string;
  is_active: boolean;
  leader_board: boolean;
  stream_id: number;
  streams: GenericType;
  test_type_list: TestType;
};

type TestType = {
  name: string;
  short_name: string;
};
export interface overAllAnalysisProps {
  loading: boolean;
  error: any;
  subjectWiseAnalysis: SubjectWiseAnalysis[] | null;
  weakerAreas: WeakerAreaAnalysis[] | null;
  difficultyAnalysis: DifficultyAnalysis[] | null;
  chapterConceptAnalysis: ChapterConceptAnalysis[] | null;
  timeAnalysis: TimeAnalysis[] | null;
  // bookmarks: BookmarksProps;
}

export interface studentStreamProps {
  error: any;
  stream: GenericType | null;
  standard: GenericType | null;
}

export type ISubjectsProps = { subjectId: number; subjectName: string; totalMarks: number };

export interface ILeaderBoardProps {
  rank: number;
  id: number;
  name: string;
  imageUrl: string;
  attemptId: string;
  totalMarks: string;
  accuracy: number;
  percentage: number;
  subjects: ISubjectsProps[];
}

export interface OverAllResultProps {
  error: any;
  overallResult: ExamResult | null;
  timeAnalysis: TimeAnalysis[];
  difficultyStats: any[];
  leaderboard: ILeaderBoardProps[];
}
export interface ExamResult {
  totalMark: number;
  maxMark: number;
  percentage: number;
  totalTime: number;
  timeTaken: number;
  avgTimePerQuestion: number;
  accuracy: number;
  totalQuestions: number;
  correctQuestions: string[];
  wrongQuestions: string[];
  leftQuestions: string[];
  subjects: SubjectDetails[];
}

export interface SubjectDetails {
  id: number;
  name: string;
  percentage: number;
  totalMarks: number;
}
export interface TimeAnalysis {
  subjectDetails: SubjectDetails;
  easyStats: QuestionStats;
  mediumStats: QuestionStats;
  hardStats: QuestionStats;
}

// Stats per difficulty level
export interface QuestionStats {
  correct: number;
  wrong: number;
  left: number;
}
export interface studentStateProps {
  error: any;
  userId: number | null;
  streams: ProfileExam[];
  standard: GenericType;
  subjects: GenericType[];
  profile: Profile;
}

type Profile = {
  name: string;
  email: string | null;
  phone: string;
  gender: string;
  dob: string;
  standard: GenericType;
  address: string;
  country: string;
  state: number;
  city: number | null;
  zip_code: string;
  role: string;
  currentExams: ProfileExam[];
  referLevel: number;
};

export interface PreviousTest {
  id: string;
  name: string;
  scheduledAt: string;
  resultAt: string;
  restrictAt: string;
  totalQuestionCount: number;
  duration: number;
  totalMarks: number;
  showSyllabus: boolean;
  startTest: boolean;
  allowRetake: boolean;
  instantResult: boolean;
  allowResume: boolean;
  reports: boolean;
  attempts: IExamAttempts[];
  testTypeId: number;
}

export type adminSelectorsStateProps = {
  error: any;
  streams: GenericType[];
  subjects: GenericType[];
  standards: SelectorsTypes[];
  qbSubjects: GenericType[];
  testTypes: GenericType[];
  packages: GenericType[];
};

export type StreamPayload = {
  streamIds: number[];
};
export type TesttypePayload = {
  testTypeIds: number[];
};

export type SubjectPayload = {
  subjectIds: number[];
};
export interface adminAcademicStateProps {
  standards: Standard[];
  streams: Streams[];
  subjects: Subject[];
  testtype: Testtype[];
  syllabusLink: {
    syllabusData: SyllabusLink[];
    filtered: boolean;
  };
  syllabus: ViewSyllabus | null;
  yearList: AcademicYearList[];
  error: any;
}
export interface Subject {
  id: number;
  name: string;
  image_file: string;
  description: string;
  sequemce: number;
  is_active: boolean;
  is_deleted: boolean;
}
export interface Streams {
  id: number;
  name: string;
  description: string;
  sequence: number;
  image_file: string;
  question_types: string;
  total_score: number;
  total_duration: number;
  time_slot: string;
  question_slot: string;
  c_marks: number;
  w_marks: number;
  l_marks: number;
  is_active: boolean;
}

export type SingleStream = {
  id: number;
  name: string;
};

export type Standard = {
  id: number;
  name: string;
  image_file: string;
  description: string;
  is_active: boolean;
  sequence: number;
  streams: SingleStream;
};

export type GenericType = {
  id: number;
  name: string;
  icon?: string;
};

export type Stream = {
  id: number;
  name: string;
};

export type QBSubjects = {
  qbSubjectId: number;
  qbSubject: string;
  qbSubjectCode: string;
  qbStatus: number;
  qbStreams: string;
};
export type ExameSection = {
  id: number;
  examId: number;
  name: string;
  sequence: number;
  maxAttempts: number;
  cMark: number;
  wMark: number;
  lMark: number;
  totalQuestions: number;
  questionType: number;
  staffId: number;
  subjectId: number;
  totalMark: number;
  subjectName: string;
  questionList: number[];
  reusedQuestionCount: number;
};

export type Testtype = {
  id: number;
  test_type: number;
  description: string;
  instructions: string;
  leader_board: boolean;
  image_file: string;
  is_active: boolean;
  stream_id: number;
  sequence: number;
  streams: Stream;
  stream: number;
  imageUrl?: any;
  isActive?: boolean | undefined;
  test_type_list: GenericType;
};

export type AdminSelectorsProps = {
  error: Error | null;
  streams: Streams[];
  subjects: GenericTypes[];
  qbSubjects: GenericTypes[];
};

export type GenericTypes = {
  id: number | string;
  value: string;
};
export type SelectorsTypes = {
  id: number;
  name: string;
};

export type ChapterTopics = {
  standardId: number;
  courseSubjectId: number;
  syllabus: SyllabusChapters[];
};

export type SyllabusChapters = {
  chapterId: number;
  chapterName: string;
  topics: Topic[];
};

export type Topic = {
  topicId: number;
  topic: string;
  checked: boolean;
  blocked: boolean;
};
export type Standards = {
  id: number;
  name: string;
  image_file: string;
  description: string;
  is_active: boolean;
  sequence: number;
  streams: GenericType;
};

export type SyllabusTopic = {
  topicId: number;
  topic: string;
  topicSequence: number;
};

export type SyllabusChapter = {
  chapterId: number;
  chapterName: string;
  chapterSequence: number;
  topics: SyllabusTopic[];
};

export type ViewSyllabus = {
  subjects: GenericType;
  standard: GenericType;
  streams: GenericType;
  syllabus: SyllabusChapter[];
};

export type SyllabusLink = {
  id: number;
  is_active: boolean;
  qbank_subject_id: number;
  sequence: number;
  standard: GenericType;
  streams: GenericType;
  subjects: GenericType;
};

export type Student = {
  id: number;
  device: 'desktop' | 'mobile';
  name: string;
  phone: string;
  screenTime: string;
  testsTaken: number;
  questions: number;
  since: string;
  lastSeen: string;
  status: 'active' | 'inactive';
  plan: 'paid' | 'free';
};

export interface AcademicYearList {
  id: number;
  startDate: string;
  endDate: string;
  streams: Stream;
  standards: Stream | null;
}

export type UploadedFile = {
  id: string;
  file: File;
  progress: number;
  uploadedSize: number;
  status: 'uploading' | 'completed';
};

type Status = {
  initiated: number;
  aborted: number;
  success: number;
};

export type StudentPurchase = {
  id: number;
  name: string;
  phone: string;
  stream: 'NEET' | 'JEE MAINS' | 'CBSE';
  standard: string;
  state: string;
  template: string;
  coupon: string | null;
  date: string;
  status: Status;
};

export type BookmarksProps = {
  error: null;
  bookMarkLists: IBookmarksProps[];
  bookMarkTypes: [];
};

export interface IBookmarksProps {
  bookmarkType: number;
  questionId: number;
  chapterName: string;
  topicName: string;
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
  solution: string;
  solutionImage: string;
  correctOption: number;
  difficulty: number;
  questionType: number;
  answerTypeQ: string;
}


// payment
export interface PaymentDetails {
  studentId: number;
  packageId: number;
  subscriptionId: number;
  orderId: string | null;
  trackingId: string | null;
  bankRefNumber: string | null;
  orderStatus: string | null;
  failureMessage: string | null;
  paymentMode: string | null;
  cardName: string | null;
  currency: string | null;
  amount: string | null;
  billingName: string | null;
  billingAddress: string | null;
  billingCity: string | null;
  billingState: string | null;
  billingZip: string | null;
  billingCountry: string | null;
  billingEmail: string | null;
  billingDate: string | null;
}
