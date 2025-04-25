import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
// import { useTranslations } from 'next-intl';

const DashboardDropdown = () => {
  // const t = useTranslations('AnalyticsDashboard');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="h-6 w-6 border border-default-300 bg-transparent ring-offset-transparent hover:bg-transparent hover:ring-0 hover:ring-transparent"
        >
          <MoreHorizontal className="h-4 w-4 text-default-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[140px] p-0">
        <DropdownMenuItem className="rounded-none border-b border-default-200 py-2 text-default-900 focus:bg-default-400 focus:text-default-100 dark:focus:text-default-900">
          28 days
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-none border-b border-default-200 py-2 text-default-900 focus:bg-default-400 focus:text-default-100 dark:focus:text-default-900">
          last month
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-none py-2 text-default-900 focus:bg-default-400 focus:text-default-100 dark:focus:text-default-900">
          last year
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DashboardDropdown;
