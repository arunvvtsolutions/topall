'use client';
import React, { useEffect, useState } from 'react';
import GenerateHeader from './generate-header';
import TestCard from './test-card';
import { setExamStatus } from '@/store/slice/onlineExamSlice';
import { useDispatch } from '@/store';

const GenerateTest = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(setExamStatus([]));
  }, []);
  return (
    <div>
      <GenerateHeader isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <TestCard isModalOpen={isModalOpen} />
    </div>
  );
};

export default GenerateTest;
