import { Icon } from '@/components/ui/icon';
import StudentGuard from '@/utils/routeGuards/StudentGuard';
import Image from 'next/image';
import Link from 'next/link';

export default function UserOnBoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudentGuard>
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <div className="flex w-full pb-3 xl:hidden">
          <Link href="/auth/login" className="flex items-center gap-2 text-B2Cgray">
            <Icon icon="heroicons:arrow-left" />
          </Link>
        </div>
        <div className="flex size-full justify-center gap-10">
          <div className="hidden h-full w-auto basis-2/5 overflow-hidden rounded-3xl border xl:block">
            <div className="size-full">
              <Image src="/images/auth/group2.svg" alt="group" width={100} height={100} className="size-full object-cover" />
            </div>
          </div>
          {children}
        </div>
      </div>
    </StudentGuard>
  );
}
