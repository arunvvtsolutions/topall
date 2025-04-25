import LayoutProvider from '@/providers/layout.provider';
import MathJaxProvider from '@/providers/mathjax-provider';
import StudentGuard from '@/utils/routeGuards/StudentGuard';

const OnlineExaminationLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <StudentGuard>
      <LayoutProvider>
        <MathJaxProvider>
          <div className="font-inter-display">{children}</div>
        </MathJaxProvider>
      </LayoutProvider>
    </StudentGuard>
  );
};

export default OnlineExaminationLayout;
