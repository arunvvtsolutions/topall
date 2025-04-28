import { StudentPurchase } from '@/types';

export const streams = [
  { id: 1, name: 'NEET' },
  { id: 2, name: 'JEE' },
  { id: 3, name: 'CBSE' }
];

export const statusList = [
  { id: 1, name: 'Active' },
  { id: 2, name: 'Inactive' },
  { id: 3, name: 'Pending' },
  { id: 4, name: 'Completed' },
  { id: 5, name: 'Rejected' },
  { id: 6, name: 'Approved' }
];

export const statesInIndia = [
  { id: 1, name: 'Andhra Pradesh' },
  { id: 2, name: 'Arunachal Pradesh' },
  { id: 3, name: 'Assam' },
  { id: 4, name: 'Bihar' },
  { id: 5, name: 'Chhattisgarh' },
  { id: 6, name: 'Goa' },
  { id: 7, name: 'Gujarat' },
  { id: 8, name: 'Haryana' },
  { id: 9, name: 'Himachal Pradesh' },
  { id: 10, name: 'Jharkhand' },
  { id: 11, name: 'Karnataka' },
  { id: 12, name: 'Kerala' },
  { id: 13, name: 'Madhya Pradesh' },
  { id: 14, name: 'Maharashtra' },
  { id: 15, name: 'Manipur' },
  { id: 16, name: 'Meghalaya' },
  { id: 17, name: 'Mizoram' },
  { id: 18, name: 'Nagaland' },
  { id: 19, name: 'Odisha' },
  { id: 20, name: 'Punjab' },
  { id: 21, name: 'Rajasthan' },
  { id: 22, name: 'Sikkim' },
  { id: 23, name: 'Tamil Nadu' },
  { id: 24, name: 'Telangana' },
  { id: 25, name: 'Tripura' },
  { id: 26, name: 'Uttar Pradesh' },
  { id: 27, name: 'Uttarakhand' },
  { id: 28, name: 'West Bengal' }
];

export const purchaseData: StudentPurchase[] = [
  {
    id: 1,
    name: 'J Naveen Singh',
    phone: '+91 9940555474',
    stream: 'NEET',
    standard: '12+',
    state: 'Rajasthan',
    template: 'Six Month ( NEET )',
    coupon: 'NEET2024',
    date: '2024-11-28T22:00:00Z',
    status: { success: 1, initiated: 1, aborted: 0 }
  },
  {
    id: 2,
    name: 'Vishwanath',
    phone: '+91 9940555474',
    stream: 'JEE MAINS',
    standard: '12+',
    state: 'Karnataka',
    template: 'Six Month ( NEET )',
    coupon: 'NEET2024',
    date: '2024-11-28T22:15:00Z',
    status: { success: 0, initiated: 1, aborted: 0 }
  },
  {
    id: 3,
    name: 'Sastha',
    phone: '+91 9940555474',
    stream: 'CBSE',
    standard: '12+',
    state: 'Tamil Nadu',
    template: 'Six Month ( NEET )',
    coupon: null,
    date: '2024-11-28T22:30:00Z',
    status: { success: 0, initiated: 1, aborted: 0 }
  },
  {
    id: 4,
    name: 'Hariharan',
    phone: '+91 9940555474',
    stream: 'NEET',
    standard: '12+',
    state: 'Andhra Pradesh',
    template: 'Six Month ( NEET )',
    coupon: null,
    date: '2024-11-28T22:45:00Z',
    status: { success: 0, initiated: 1, aborted: 1 }
  },
  {
    id: 5,
    name: 'Bharath Ravi',
    phone: '+91 9940555474',
    stream: 'JEE MAINS',
    standard: '12+',
    state: 'Andhra Pradesh',
    template: 'Six Month ( NEET )',
    coupon: 'NEET2024',
    date: '2024-11-28T23:00:00Z',
    status: { success: 0, initiated: 1, aborted: 1 }
  },
  {
    id: 6,
    name: 'Sreekumar',
    phone: '+91 9940555474',
    stream: 'CBSE',
    standard: '12+',
    state: 'Andhra Pradesh',
    template: 'Six Month ( NEET )',
    coupon: null,
    date: '2024-11-28T23:15:00Z',
    status: { success: 1, initiated: 1, aborted: 1 }
  },
  {
    id: 7,
    name: 'Deepa Tamilarasan',
    phone: '+91 9940555474',
    stream: 'NEET',
    standard: '12+',
    state: 'Tamil Nadu',
    template: 'Six Month ( NEET )',
    coupon: 'NEET2024',
    date: '2024-11-28T23:30:00Z',
    status: { success: 0, initiated: 1, aborted: 1 }
  },
  {
    id: 8,
    name: 'Yogesh Tester',
    phone: '+91 9940555474',
    stream: 'JEE MAINS',
    standard: '12+',
    state: 'Tamil Nadu',
    template: 'Six Month ( NEET )',
    coupon: 'NEET2024',
    date: '2024-11-28T23:45:00Z',
    status: { success: 1, initiated: 1, aborted: 1 }
  },
  {
    id: 9,
    name: 'Mohammed Ijaz',
    phone: '+91 9940555474',
    stream: 'CBSE',
    standard: '12+',
    state: 'Tamil Nadu',
    template: 'Six Month ( NEET )',
    coupon: null,
    date: '2024-11-29T00:00:00Z',
    status: { success: 0, initiated: 1, aborted: 1 }
  },
  {
    id: 10,
    name: 'Venkata Rama',
    phone: '+91 9940555474',
    stream: 'CBSE',
    standard: '12+',
    state: 'Tamil Nadu',
    template: 'Six Month ( NEET )',
    coupon: 'NEET2024',
    date: '2024-11-29T00:15:00Z',
    status: { success: 0, initiated: 1, aborted: 1 }
  }
];

export const purchaseAnalytics = {
  totalPurchases: {
    title: 'TOTAL PURCHASES',
    value: 180616,
    percentageChange: 32.4,
    showIcon: true,
    status: true,
    className: 'pr-[90px] sm:pr-0'
  },
  neet: {
    title: 'NEET',
    value: 72000,
    percentageChange: 32.4,
    showIcon: false,
    status: false
  },
  jee: {
    title: 'JEE MAINS',
    value: 30000,
    percentageChange: 32.4,
    showIcon: false,
    status: false,
    className: 'sm:pl-[96px] lg:pl-0'
  },
  cbse: {
    title: 'CBSE',
    value: 20000,
    percentageChange: 32.4,
    showIcon: false,
    status: true
  }
};
