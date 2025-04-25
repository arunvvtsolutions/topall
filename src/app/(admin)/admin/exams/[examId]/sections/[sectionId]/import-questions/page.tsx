import ImportQuestions from '@/components/admin/exams/importquestions';
import ExamSectionBreadcrumb from '@/components/admin/sections/breadcrumb';

export default function ImportQuestionsPage({ params }: { params: { examId: string; sectionId: string } }) {


  return (
    <div>
      <ExamSectionBreadcrumb />
      {/* Add your questions list or component here */}
      <ImportQuestions examId={Number(params.examId)} sectionId={Number(params.sectionId)} />
    </div>
  );
}
