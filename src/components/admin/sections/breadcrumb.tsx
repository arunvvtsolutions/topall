'use client';

import React, { useMemo } from 'react';
import { useParams, usePathname } from 'next/navigation';
import BreadCrumb, { type BreadCrumbType } from '@/components/common/breadcrumb';
import useExamDetails from '@/hooks/use-exam-details';

const ExamSectionBreadcrumb = () => {
  const params = useParams();
  const pathname = usePathname();

  const { sectionId, examId } = params as { sectionId: string; examId: string };
  const examTitle = useExamDetails(Number(examId));

  // Determine current page type from pathname
  const pageType = useMemo(() => {
    let type = 'Add Questions';
    if (pathname.endsWith('import-questions')) {
      type = 'Import Questions';
    } else if (pathname.endsWith('view-questions')) {
      type = 'View Questions';
    }
    return type;
  }, [pathname]);

  // Generate link based on page type
  const currentPageLink = useMemo(() => {
    const basePath = `/admin/exams/${examId}/sections/${sectionId}`;
    let link = `${basePath}/add-questions`;

    if (pageType === 'Import Questions') {
      link = `${basePath}/import-questions`;
    } else if (pageType === 'View Questions') {
      link = `${basePath}/view-questions`;
    }
    return link;
  }, [examId, sectionId, pageType]);

  // Memoize breadcrumb data to prevent unnecessary recalculations
  const breadCrumbData = useMemo<BreadCrumbType[]>(() => {
    if (!examTitle) return [];

    return [
      {
        title: 'Exams',
        link: '/admin/exams'
      },
      {
        title: examTitle,
        link: `/admin/exams/${examId}/sections`
      },
      {
        title: pageType,
        link: currentPageLink
      }
    ];
  }, [examId, examTitle, pageType, currentPageLink]);

  // Don't render anything until we have the exam title and breadcrumb data
  if (!examTitle || breadCrumbData.length === 0) return null;

  return <BreadCrumb items={breadCrumbData} title="Dashboard" />;
};

export default React.memo(ExamSectionBreadcrumb);
