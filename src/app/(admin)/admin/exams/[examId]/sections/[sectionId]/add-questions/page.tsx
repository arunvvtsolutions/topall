import React from 'react';
import AddQuestions from '@/components/admin/sections/add-questions';
import ExamSectionBreadcrumb from '@/components/admin/sections/breadcrumb';

interface AddQuestionsPageProps {
  params: {
    examId: string;
    sectionId: string;
  };
}

const AddQuestionsPage = ({ params }: AddQuestionsPageProps) => {
  const { examId, sectionId } = params;

  return (
    <div>
      <ExamSectionBreadcrumb />
      {/* Add your questions list or component here */}
      <AddQuestions examId={Number(examId)} sectionId={Number(sectionId)} />
    </div>
  );
};

export default AddQuestionsPage;
