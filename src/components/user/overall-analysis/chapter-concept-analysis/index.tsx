'use client';
import React, { useEffect, useState } from 'react';
import DesktopView from './DesktopView';
import MobileView from './MobileView';
import { useSelector } from '@/store';
import { useParams } from 'next/navigation';

const ChapterConceptAnalysis = () => {
  const params = useParams();
  const subject = params.subject;
  const { chapterConceptAnalysis } = useSelector((state) => state.overAllAnallysis);

  const [currentSubject, setCurrentSubject] = useState<any>([]);

  useEffect(() => {
    if (subject && chapterConceptAnalysis) {
      const filteredSubject = chapterConceptAnalysis?.find((item) => item.subjectId == subject);
      setCurrentSubject(filteredSubject);
    }
  }, [subject, chapterConceptAnalysis]);

  return (
    <>
      <DesktopView subject={currentSubject} />
      <MobileView subject={currentSubject} />
    </>
  );
};

export default ChapterConceptAnalysis;
