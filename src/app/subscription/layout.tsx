import LayoutProvider from '@/providers/layout.provider';
import StudentGuard from '@/utils/routeGuards/StudentGuard';

const SubscriptionLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <StudentGuard>
      <LayoutProvider>
        <div className="font-inter-display">{children}</div>
      </LayoutProvider>
    </StudentGuard>
  );
};

export default SubscriptionLayout;
