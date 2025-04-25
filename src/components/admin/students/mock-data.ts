import { GenericType, Student } from '@/types';

export const academicYears: GenericType[] = [
  { name: 'Academic Year', id: 0 },
  { name: '2024', id: 1 },
  { name: '2025', id: 2 },
  { name: '2026', id: 3 }
];

export const students: Student[] = [
  {
    id: 1,
    device: 'mobile',
    name: 'Seetha',
    phone: '+91 9840555474',
    screenTime: '46Hrs',
    testsTaken: 36,
    questions: 738,
    since: '28/11/24,10:00PM',
    lastSeen: '28/11/24,10:00PM',
    status: 'active',
    plan: 'free'
  },
  {
    id: 2,
    device: 'desktop',
    name: 'Hariharan',
    phone: '+91 9840555474',
    screenTime: '46Hrs',
    testsTaken: 100,
    questions: 28,
    since: '28/11/24,10:00PM',
    lastSeen: '28/11/24,10:00PM',
    status: 'active',
    plan: 'paid'
  },
  {
    id: 3,
    device: 'mobile',
    name: 'Sreekumar',
    phone: '+91 9840555474',
    screenTime: '46Hrs',
    testsTaken: 50,
    questions: 58,
    since: '28/11/24,10:00PM',
    lastSeen: '28/11/24,10:00PM',
    status: 'active',
    plan: 'free'
  },
  {
    id: 4,
    device: 'desktop',
    name: 'Deepa Tamilarasan',
    phone: '+91 9840555474',
    screenTime: '46Hrs',
    testsTaken: 78,
    questions: 10,
    since: '28/11/24,10:00PM',
    lastSeen: '28/11/24,10:00PM',
    status: 'active',
    plan: 'free'
  },
  {
    id: 5,
    device: 'desktop',
    name: 'Yogesh Tester',
    phone: '+91 9840555474',
    screenTime: '46Hrs',
    testsTaken: 350,
    questions: 1485,
    since: '28/11/24,10:00PM',
    lastSeen: '28/11/24,10:00PM',
    status: 'active',
    plan: 'free'
  },
  {
    id: 6,
    device: 'desktop',
    name: 'Venkata Rama',
    phone: '+91 9840555474',
    screenTime: '46Hrs',
    testsTaken: 18,
    questions: 4858,
    since: '28/11/24,10:00PM',
    lastSeen: '28/11/24,10:00PM',
    status: 'active',
    plan: 'free'
  },
  {
    id: 7,
    device: 'mobile',
    name: 'Arun Kumar',
    phone: '+91 9840555474',
    screenTime: '38Hrs',
    testsTaken: 45,
    questions: 720,
    since: '27/11/24,09:30PM',
    lastSeen: '28/11/24,08:45PM',
    status: 'inactive',
    plan: 'free'
  },
  {
    id: 8,
    device: 'desktop',
    name: 'Priya Sharma',
    phone: '+91 9840555474',
    screenTime: '52Hrs',
    testsTaken: 62,
    questions: 890,
    since: '26/11/24,11:15AM',
    lastSeen: '28/11/24,09:20PM',
    status: 'active',
    plan: 'free'
  },
  {
    id: 9,
    device: 'desktop',
    name: 'Rajesh Khanna',
    phone: '+91 9840555474',
    screenTime: '29Hrs',
    testsTaken: 15,
    questions: 320,
    since: '25/11/24,02:45PM',
    lastSeen: '27/11/24,04:30PM',
    status: 'inactive',
    plan: 'free'
  },
  {
    id: 10,
    device: 'mobile',
    name: 'Ananya Patel',
    phone: '+91 9840555474',
    screenTime: '41Hrs',
    testsTaken: 38,
    questions: 645,
    since: '24/11/24,08:20AM',
    lastSeen: '28/11/24,07:15PM',
    status: 'active',
    plan: 'free'
  }
];

export const status: GenericType[] = [
  { name: 'All', id: 0 },
  { name: 'Active', id: 1 },
  { name: 'InActive', id: 2 }
];

export const plans: GenericType[] = [
  { name: 'All', id: 0 },
  { name: 'Paid', id: 1 },
  { name: 'Free', id: 2 }
];

export const studentsStatus = [
  {
    title: 'Total Users',
    count: '1,60,616',
    change: '+32.40%',
    timeframe: 'last month',
    percentage: 80,
    status: 1
  },
  {
    title: 'Users Verified',
    count: '51,665',
    change: '-32.40%',
    timeframe: 'last month',
    percentage: 64,
    status: 0
  },
  {
    title: '11TH Total Students',
    count: '23,645',
    change: '+32.40%',
    timeframe: 'last month',
    percentage: 80,
    status: 1
  },
  {
    title: '12TH Total Users',
    count: '37,106',
    change: '+32.40%',
    timeframe: 'last month',
    percentage: 64,
    status: 1
  }
];
