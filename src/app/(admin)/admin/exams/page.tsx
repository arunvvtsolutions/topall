import ExamsList from '@/components/admin/exams';
import { LucideLoader } from '@/components/common/LucideLoader';
import FallbackLoader from '@/components/ui/fallback-loader';
import { Suspense } from 'react';

const AdminExamPage = () => {
  return (
    <Suspense fallback={<FallbackLoader />}>
      <ExamsList />
    </Suspense>
  );
}
export default AdminExamPage;
