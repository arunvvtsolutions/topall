import ExamResults from '@/components/user/result';

const ExamResultPage = ({ params }: { params: { testId: number } }) => {
  return (
    <div className="bg-screenbackground">
      <div className="mx-auto px-4 md:container">
        <ExamResults testId={params.testId} />
      </div>
    </div>
  );
};

export default ExamResultPage;
