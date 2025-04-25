'use client';
import React, { useEffect } from 'react';
import ChapterWiseTabs from './chapter-wise-tabs';
import { useDispatch } from '@/store';
import { setExamStatus } from '@/store/slice/onlineExamSlice';

const ChapterTest = () => {
  return <ChapterWiseTabs />;
};

export default ChapterTest;
