import LayoutProvider from '@/providers/layout.provider';
import Sidebar from '@/components/partials/sidebar';
import Header from '@/components/partials/header';
import LayoutUserContentProvider from '@/providers/user.content.provider';
import MathJaxProvider from '@/providers/mathjax-provider';
import StudentGuard from '@/utils/routeGuards/StudentGuard';

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <StudentGuard>
      <LayoutProvider>
        <Header />
        <Sidebar />
        <LayoutUserContentProvider>
          <MathJaxProvider>{children} </MathJaxProvider>
        </LayoutUserContentProvider>
      </LayoutProvider>
    </StudentGuard>
  );
};

export default UserLayout;
