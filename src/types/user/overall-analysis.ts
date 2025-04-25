export type SubjectWiseAnalysis = {
  correct: number;
  left: number;
  subject: string;
  subjectId: string;
  wrong: number;
};

export type WeakerAreaAnalysis = {
  accuracy: number;
  correctQues: string[];
  leftQues: string[];
  topic: string;
  topicId: string;
  wrongQues: string[];
};

export type DifficultyStats = {
  id: number;
  name: string;
  correct: { count: number; percentage: string };
  wrong: { count: number; percentage: string };
  left: { count: number; percentage: string };
};

export type DifficultyAnalysis = {
  subject_id: number;
  subject_name: string;
  difficulty: DifficultyStats[];
};

export type ChapterStats = {
  chapterId: string;
  chapter: string;
  average: number;
  correctQues: string[];
  wrongQues: string[];
  leftQues: string[];
  topics: TopicStats[];
  totalQuestions: number;
};

export type ChapterConceptAnalysis = {
  subject: string;
  subjectId: string;
  chapters: ChapterStats[];
};

export type TimeAnalysis = {
  id: number;
  name: string;
  correct: number;
  wrong: number;
  left: number;
};

export type TopicStats = {
  topicId: string;
  topic: string;
  average: number;
  correctQues: string[];
  wrongQues: string[];
  leftQues: string[];
  totalQuestions: number;
};
