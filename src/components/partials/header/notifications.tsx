import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
// import { Link } from '@/i18n/routing';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { notifications, type Notification } from './data';
import shortImage from '@/public/images/all-img/short-image-2.png';
import { Icon } from '@/components/ui/icon';
import Link from 'next/link';

const Notifications = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="focus:ring-none relative hidden flex-col items-center justify-center rounded-full text-secondary-foreground focus:outline-none md:flex md:h-8 md:w-8 md:bg-secondary"
        >
          <Icon icon="heroicons-outline:bell" className="h-5 w-5 animate-tada" />
          <Badge
            className="absolute bottom-[calc(100%-10px)] left-[calc(100%-12px)] h-4 w-4 items-center justify-center rounded-full p-0 text-[8px] font-semibold"
            color="destructive"
          >
            2
          </Badge>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[999] mx-4 p-0 lg:w-[320px]">
        <DropdownMenuLabel>
          <div className="flex justify-between border-b border-default-100 px-4 py-3">
            <div className="text-sm font-medium text-default-800">Notifications</div>
            <div className="text-xs text-default-800 md:text-right">
              <Link href="/notifications" className="underline">
                View all
              </Link>
            </div>
          </div>
        </DropdownMenuLabel>
        <div className="h-[300px] xl:h-[350px]">
          <ScrollArea className="h-full">
            {notifications.map((item: Notification, index: number) => (
              <DropdownMenuItem
                key={`inbox-${index}`}
                className="group flex cursor-pointer gap-9 px-4 py-2"
              >
                <div className="flex flex-1 items-start gap-2">
                  <div className="flex-none">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item.avatar} />
                      <AvatarFallback> {item.title.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="truncate text-sm font-normal text-default-600 dark:group-hover:text-default-800">
                      {item.title}
                    </div>
                    <div className="line-clamp-1 text-xs font-light text-default-600 dark:group-hover:text-default-700">
                      {item.desc}
                    </div>
                    <div className="text-xs text-default-400 dark:group-hover:text-default-500">
                      {' '}
                      {item.date}
                    </div>
                  </div>
                </div>
                {item.unreadmessage && (
                  <div className="flex-0">
                    <span className="inline-block h-[10px] w-[10px] rounded-full border border-destructive-foreground bg-destructive dark:border-default-400" />
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
