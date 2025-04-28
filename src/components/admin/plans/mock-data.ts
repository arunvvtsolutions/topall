// Define types for better type safety
export interface Plan {
  id: number;
  title: string;
  active: boolean;
  grades: string[];
  description: string;
  notifications: number;
  stream: string; // Added stream property to track which exam type it belongs to
  archived: boolean; // Added archived property
}

export const mockData: Record<string, Plan[]> = {
  NEET: [
    {
      id: 1,
      title: 'FREE PLAN WITH PREMIUM SUBSCRIPTION PLANS AND',
      active: true,
      grades: ['6TH', '7TH', '8TH', '9TH', '10TH', '11TH', '12TH', '12+'],
      description: ' to all users who aspires to top all in NEET and JEE MAINS',
      notifications: 2,
      stream: 'NEET',
      archived: false
    },
    {
      id: 2,
      title: 'GOLD PLAN',
      active: true,
      grades: ['6TH', '7TH', '8TH', '9TH', '10TH', '11TH', '12TH', '12+', '8TH', '9TH', '10TH'],
      description:
        "You'll get full access to all test types and unlimited test as well, this plan is applicable to all users who aspires to top all in NEET and JEE MAINS, JEE MAINS practice tests and study materials, ideal for students preparing for engineering entrance exams.JEE MAINS practice tests and study materials, ideal for students preparing for engineering entrance exams.",
      notifications: 1,
      stream: 'NEET',
      archived: false
    }
  ],
  'JEE MAINS': [
    {
      id: 3,
      title: 'BASIC PLAN',
      active: true,
      grades: ['11TH', '12TH', '12+'],
      description:
        "You'll get access to JEE MAINS practice tests and study materials, ideal for students preparing for engineering entrance exams.",
      notifications: 0,
      stream: 'JEE MAINS',
      archived: false
    },
    {
      id: 4,
      title: 'PREMIUM PLAN',
      active: false,
      grades: ['11TH', '12TH', '12+'],
      description:
        'Complete JEE MAINS preparation with mock tests, personalized feedback, and advanced problem-solving techniques.',
      notifications: 3,
      stream: 'JEE MAINS',
      archived: false
    }
  ],
  CBSE: [], // Empty by default to show the "Add new Package Plan" card
  ARCHIVE: [
    {
      id: 5,
      title: 'ARCHIVED NEET PLAN',
      active: false,
      grades: ['6TH', '7TH', '8TH'],
      description: 'This is an archived NEET plan that was previously available.',
      notifications: 0,
      stream: 'NEET',
      archived: true
    },
    {
      id: 6,
      title: 'OLD JEE PLAN',
      active: false,
      grades: ['11TH', '12TH'],
      description: 'This JEE MAINS plan has been archived and is no longer available to users.',
      notifications: 0,
      stream: 'JEE MAINS',
      archived: true
    },
    {
      id: 7,
      title: 'ARCHIVED CBSE PLAN',
      active: false,
      grades: ['9TH', '10TH'],
      description: 'An archived CBSE plan from the previous academic year.',
      notifications: 0,
      stream: 'CBSE',
      archived: true
    }
  ]
};

export const streams = [
  { name: 'NEET', id: 1 },
  { name: 'JEE MAINS', id: 2 },
  { name: 'CBSE', id: 3 }
];

export const testTypesMock = [
  { id: 1, name: 'Test A' },
  { id: 2, name: 'Test B' },
  { id: 3, name: 'Test C' }
];

export const standardsMock = [
  { id: 1, name: 'Standard 1' },
  { id: 2, name: 'Standard 2' },
  { id: 3, name: 'Standard 3' }
];

export const periodOptions = [
  { name: 'Overall', id: 1 },
  { name: 'Monthly', id: 2 },
  { name: 'Till', id: 3 }
];

export const levels = [
  { id: 'level1', label: 'Level 1' },
  { id: 'level2', label: 'Level 2' },
  { id: 'level3', label: 'Level 3' },
  { id: 'level4', label: 'Level 4' },
  { id: 'level5', label: 'Level 5' },
  { id: 'previousYear', label: 'Previous Year' }
];

export const subjectsData = {
  Physics: ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4'],
  Chemistry: ['Chapter 1', 'Chapter 2', 'Chapter 3'],
  Botany: ['Chapter 1', 'Chapter 2'],
  Zoology: ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5', 'Chapter 6', 'Chapter 7', 'Chapter 8', 'Chapter 9']
};

export const subjectsData1 = {
  Physics: ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4'],
  Chemistry: ['Chapter 1', 'Chapter 2', 'Chapter 3'],
  Botany: ['Chapter 1', 'Chapter 2'],
  Zoology: ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5', 'Chapter 6', 'Chapter 7', 'Chapter 8', 'Chapter 9']
};
