'use client';
import PageHeader from '@/components/common/PageHeader';
import React from 'react';
import SubjectCard from './subjects';
import StandardCard from './standard';
import StreamCard from './stream';
import SyllabusCard from './syllabus linking';
import { HeadersTitle } from '@/types/enum';
import TesttypeCard from './testtype';
import { useSession } from 'next-auth/react';
import AcademicYear from './academicYear';

export default function Academic() {
  return (
    <div className="grid-cols grid space-y-8">
      <PageHeader title={HeadersTitle.ACADEMIC_SETUP} />
      <SubjectCard />
      <StreamCard />
      <StandardCard />
      <SyllabusCard />
      <TesttypeCard />
      <AcademicYear />
    </div>
  );
}
