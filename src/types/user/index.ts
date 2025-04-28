import { GenericType } from '..';

export type TestListProps = {
  examList: Exam[];
  nextCursor: string;
  nextPageResult: boolean;
  prevCursor: string;
  prevPageResult: boolean;
  totalExamCount: number;
  totalPages: number;
};

export interface Exam {
  allowResume: boolean;
  allowRetake: boolean;
  duration: number;
  id: string;
  name: string;
  restrictAt: string;
  resultAt: string;
  scheduledAt: string;
  showSyllabus: boolean;
  totalMarks: number;
  totalQuestionCount: number;
  attempts: IExamAttempts[];
  instantResult: boolean;
  testTypeId: number;
}

export interface IExamAttempts {
  attemptId: string;
  accuracy: number;
  securedMarks: number;
  time: string;
}

export interface examDates {
  examId: string;
  scheduledAt: string;
}

export interface SyllabusSection {
  subjectName: string;
  chapterNames: string[];
}

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

export interface Subject {
  subjectId: number;
  subjectName: string;
  totalQuestionsCount: number;
  topicsAndChapters: Chapter[];
}

export interface ProfileTarget {
  id?: number;
  name: string;
  targetYear: string;
  targetScore: string;
}

export interface ProfilePayload {
  studentId: number;
  name: string;
  stateId: number;
  referalCode: string;
  currentExam: { streamId: number; standardId: number }[];
  target: ProfileTarget[];
  referLevel: number;
  profileImage: string;
  gender: string | null;
  dob: string | null;
  address: string;
  city: 0;
  zipcode: string;
  best: {
    streamId: number;
    streamName: string;
    targetYear: string;
    targetScore: number;
    subjects: {
      id: number;
      name: string;
      star: number;
    }[];
  }[];
  email: string;
}

export interface ChapterWIseTests {
  chapterId: number;
  chapterName: string;
  level: number | null;
  subjectId: number;
  updatedLevel: number;
}

export interface Referral {
  totalPages: number;
  prevCursor: string;
  nextCursor: string;
  nextPageResult: boolean;
  prevPageResult: boolean;
  referredStudentsCount: number;
  totalCount: number;
  referredStudents: ReferredUser[];
}

export interface ReferredUser {
  studentId: string;
  name: string;
  profileImage: string | null;
  benefitedDays: number;
  dateJoined: string;
}
export interface ExamDataItem {
  streamId: number;
  streamName: string;
  targetYear: string;
  targetScore: string;
  subjects: {
    id: number;
    name: string;
    star: number;
  }[];
}

export type ExamData = ExamDataItem[];
export interface Target {
  id: number;
  name: string;
  targetYear: string;
  targetScore: string;
}
export interface ProfileExam {
  id: number;
  name: string;
  image_file: string;
  is_active: boolean;
}

export interface Role {
  id: number;
  role: string;
  name: string;
  avatar: string;
  isActive: boolean;
}

export type UserProfileType = {
  userId: number | null;
  joinedData: string;
  name: string;
  mobileNumber: string;
  email: string;
  onBoardData: boolean;
  currentExams: ProfileExam[];
  userTimeZone: string;
  loginCountry: string;
  uuidNumber: string;
  referalCode: string;
  lastLoginTime: string | null;
  lastLogoutTime: string | null;
  profileImage: string | null;
  target: Target[];
  isActive: boolean;
  loginDevice: string;
  role: Role;
  dob: string | null;
  state: number | null;
  city: number | null;
  referLevel: number;
  standard?: {
    streamId: number;
    standard: GenericType;
  }[];
  address: string;
  zipCode: string;
  gender: string | null;
  best: ExamData | null;
  testExpiry: string | null;
  daysExpiry: string | null;
};
