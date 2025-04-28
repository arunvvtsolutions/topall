import SectionList from '@/components/admin/sections';
import FallbackLoader from '@/components/ui/fallback-loader';
import { Suspense } from 'react';

const AdminExamPage = () => {
  return (
    <Suspense fallback={<FallbackLoader />}>
      <SectionList />
    </Suspense>
  );
};
export default AdminExamPage;
