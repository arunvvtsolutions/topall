import LoginGuard from '@/utils/routeGuards/LoginGuard';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <LoginGuard>
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <div className="flex h-full w-full justify-center gap-10">
          <div className="hidden h-full w-auto basis-2/5 overflow-hidden rounded-3xl border xl:block">
            <div className="h-full w-full">
              <Image src="/images/auth/group1.svg" alt="group" width={100} height={100} className="h-full w-full object-cover" />
            </div>
          </div>
          {children}
        </div>
      </div>
    </LoginGuard>
  );
}
