import LayoutProvider from '@/providers/layout.provider';
import LayoutUserContentProvider from '@/providers/user.content.provider';
import StudentGuard from '@/utils/routeGuards/StudentGuard';

const ReferalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <StudentGuard>
      <LayoutProvider>{children}</LayoutProvider>
    </StudentGuard>
  );
};

export default ReferalLayout;
