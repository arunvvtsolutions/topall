'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { getSingleTest } from '@/utils/api/exams';
import { Button } from '@/components/ui/button';
import { AdminOnlyGroups, ButtonNames, Roles } from '@/types/enum';
import BreadCrumb, { type BreadCrumbType } from '@/components/common/breadcrumb';
import SectionCard from './section-card';
import { useSelector } from '@/store';

// Define a proper type for the exam data
interface ExamData {
  id: number;
  name: string;
  marks: number;
  // Add other properties as needed
}

const SectionList = () => {
  const { examId } = useParams();
  const user = useSelector((state) => state.userProfile);

  // const breadcrumbItems = AdminOnlyGroups.includes(user.role.role as Roles)
  //   ? [{ label: 'Dashboard', href: '/' }, { label: 'Exams', href: '/admin/exams' }, { label: 'Sections' }]
  //   : [{ label: 'Exams', href: '/admin/exams' }, { label: 'Sections' }];

  // Consolidate related state into a single object
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [totalAddedMarks, setTotalAddedMarks] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch exam details
  useEffect(() => {
    const fetchExamData = async () => {
      setIsLoading(true);
      try {
        const response = await getSingleTest(Number(examId));
        setExamData(response);
      } catch (error) {
        console.error('Error fetching test details:', error);
        toast.error('Failed to fetch test details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamData();
  }, [examId]);

  // const breadcrumbItems = AdminOnlyGroups.includes(user.role.role as Roles)
  //   ? [{ label: 'Dashboard', href: '/' }, { label: 'Exams', href: '/admin/exams' }, { label: 'Sections' }]
  //   : [{ label: 'Exams', href: '/admin/exams' }, { label: 'Sections' }];

  // Memoize breadcrumb items to prevent unnecessary recalculations
  const breadcrumbItems = useMemo<BreadCrumbType[]>(() => {
    if (!examData?.name) return [];

    const items = AdminOnlyGroups.includes(user.role.role as Roles)
      ? [
          { title: 'Exams', link: '/admin/exams' },
          { title: examData.name, link: '' }
        ]
      : [
          { title: 'Exams', link: '/admin/exams' },
          { title: examData.name, link: '' }
        ];
    return items;
  }, [examData?.name]);

  // Show nothing while loading or if no exam data is available
  if (isLoading || !examData) return null;

  return (
    <div className="p-5">
      <div className="mb-3 flex items-start justify-between pr-0">
        {breadcrumbItems.length > 0 && <BreadCrumb items={breadcrumbItems} title="Dashboard" />}
        <Button variant="default" color="primary" size="md" className="text-sm font-medium">
          {ButtonNames.TOTAL_MARKS} {totalAddedMarks}/{examData.marks}
        </Button>
      </div>
      <SectionCard singleTest={examData} setMarks={setTotalAddedMarks} />
    </div>
  );
};

export default React.memo(SectionList);
