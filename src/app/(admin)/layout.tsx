import LayoutProvider from '@/providers/layout.provider';
import LayoutContentProvider from '@/providers/content.provider';
import Sidebar from '@/components/partials/sidebar';
import Footer from '@/components/partials/footer';
import Header from '@/components/partials/header';
import MathJaxProvider from '@/providers/mathjax-provider';
import AdminGuard from '@/utils/routeGuards/AdminGuard';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AdminGuard>
      <LayoutProvider>
        <Header />
        <Sidebar />
        <LayoutContentProvider>
          <MathJaxProvider>{children}</MathJaxProvider>
        </LayoutContentProvider>
        {/* <Footer /> */}
      </LayoutProvider>
    </AdminGuard>
  );
};

export default AdminLayout;
