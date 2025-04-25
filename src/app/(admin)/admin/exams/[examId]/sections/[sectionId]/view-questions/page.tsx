import ExamSectionBreadcrumb from '@/components/admin/sections/breadcrumb';
import ViewQuestions from '@/components/admin/sections/view-questions';
import BreadCrumb, { BreadCrumbType } from '@/components/common/breadcrumb';

interface ViewQuestionsPageProps {
  params: {
    examId: string;
    sectionId: string;
  };
}

export default function ViewQuestionsPage({ params }: ViewQuestionsPageProps) {
  const { examId, sectionId } = params;

  return (
    <div>
      <ExamSectionBreadcrumb />
      {/* Add your questions list or component here */}
      <ViewQuestions examId={examId} sectionId={sectionId} />
    </div>
  );
}
