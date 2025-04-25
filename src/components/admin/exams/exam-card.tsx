'use client';

import { memo, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ExamList } from '@/types/exams';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { formatTimestamp, generateColor, getInitials, separateDateTime } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AdminOnlyGroups, Roles } from '@/types/enum';
import { useSession } from 'next-auth/react';
import { useSelector } from '@/store';

interface ExamCardProps extends ExamList {
  onChangePin: (id: string, pin: string | null) => void;
  onChangePublish: (id: string, published: boolean, startDate: string | Date) => void;
  reusedquestionid: (id: string) => void;
  updateExamHandler: (id: string) => void;
  deleteExamHandler: (id: string) => void;
  handleSectionPage: (id: string) => void;
  viewSyllabus: (id: string) => void;
  showPackage: boolean;
  onShowPackage: (id: string) => void;
}

const ExamCard = ({
  id,
  name,
  testTypes,
  standard,
  duration,
  totalMarks,
  currentAddedQuestionCount,
  reusedQuestionCount,
  totalQuestionCount,
  scheduledAt,
  resultAt,
  streams,
  faculties,
  published,
  pin,
  packages,
  onChangePin,
  onChangePublish,
  reusedquestionid,
  updateExamHandler,
  deleteExamHandler,
  handleSectionPage,
  viewSyllabus,
  showPackage,
  onShowPackage
}: ExamCardProps) => {
  const { date, time } = separateDateTime(scheduledAt || '');
  const user = useSelector((state) => state.userProfile);
  const endDateTimeformat = formatTimestamp(resultAt || '');
  const AVATAR_LIMIT = 4;
  return (
    <>
      <Card
        className={`relative mb-4 overflow-hidden py-4 before:absolute before:left-[-30px] before:top-0 before:w-[61px] before:rotate-[-45deg] ${published ? 'before:bg-success' : 'before:bg-destructive'} before:p-3 before:content-['']`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-0">
          <div className="flex h-5 w-2/3 flex-1 items-center space-x-2">
            <div className="font-bold text-B2CAgray">{id}</div>
            <Separator orientation="vertical" className="bg-B2CAgray/50" />
            <TooltipProvider delayDuration={1000}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-default truncate text-sm font-semibold text-B2CAgray">{testTypes?.name}</div>
                </TooltipTrigger>
                <TooltipContent color="default">
                  <p>{testTypes?.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Separator orientation="vertical" className="bg-B2CAgray/50" />
            <TooltipProvider delayDuration={1000}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-default truncate text-sm font-semibold text-B2CAgray">{standard?.name}</div>
                </TooltipTrigger>
                <TooltipContent color="default">
                  <p>{standard?.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Separator orientation="vertical" className="bg-B2CAgray/50" />
            <Button
              variant="default"
              size="icon"
              className={`!ml-0 ${showPackage ? 'text-primary' : 'text-B2CAgray'} `}
              onClick={() => onShowPackage(id)}
            >
              <Icon icon={showPackage ? 'ri:box-3-fill' : 'ri:box-3-line'} fontSize={18} />
            </Button>
          </div>
          {AdminOnlyGroups.includes(user.role.role as Roles) && (
            <div className="flex w-1/3 items-center justify-end">
              <div className="flex items-center">
                {pin && (
                  <Button variant="default" size="icon">
                    <Icon icon="icon-park-solid:pin" fontSize={18} />
                  </Button>
                )}
              </div>
              <Button
                variant="default"
                size="icon"
                className="transform text-B2CAgray group-hover/item:visible"
                onClick={() => onChangePublish(id, published, scheduledAt)}
                aria-label={published ? 'Unpublish exam' : 'Publish exam'}
              >
                <Icon icon={published ? 'mage:eye-off' : 'mage:eye'} fontSize={22} />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="icon" className="text-muted-foreground">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => updateExamHandler(id)}>Edit Test</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deleteExamHandler(id)}>Delete Test</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onChangePin(id, pin)}>{pin ? 'Unpin Test' : 'Pin Test'}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </CardHeader>
        <CardContent className="mb-2 space-y-2 px-4 py-0">
          <div className="flex items-center justify-between">
            <Button
              variant="default"
              size="sm"
              className="!px-0 text-sm font-semibold text-B2CAgrayn"
              onClick={() => handleSectionPage(id)}
            >
              {name}
              <Icon icon={'si:chevron-right-alt-fill'} className="text-base transition-all" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex h-5 space-x-2">
              <div className="text-xs text-B2CAgray lg:text-sm">{`${currentAddedQuestionCount}/${totalQuestionCount} Questions`}</div>
              <Separator orientation="vertical" className="bg-B2CAgray/50" />
              <div className="text-xs text-B2CAgray lg:text-sm">{totalMarks} Marks</div>
              <Separator orientation="vertical" className="bg-B2CAgray/50" />
              <div className="text-xs text-B2CAgray lg:text-sm">{duration} Mins</div>
            </div>
            <Button
              onClick={() => viewSyllabus(id)}
              variant="default"
              size="sm"
              className="!px-0 text-sm font-semibold text-B2CAgray"
            >
              Syllabus
              <Icon icon={'si:chevron-right-alt-fill'} className="text-base transition-all" />
            </Button>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2">
                <Icon icon="lucide:calendar-days" className="text-base transition-all" />
                {date}
              </span>
              <span className="flex items-center gap-2">
                <Icon icon="ic:outline-access-time" className="text-base transition-all" />
                {time}
              </span>
            </div>
            <Badge color="default" rounded="full" className="bg-primary/10 text-primary">
              <Icon icon="icon-park-outline:dot" fontSize="12px" className="mr-1 text-inherit" />
              {streams?.name}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="mt-3 border-t !p-0 !px-4">
          {showPackage ? (
            <div className="mt-4 flex w-full items-center gap-2">
              {packages.length > 0 ? (
                packages.map((item: any) => (
                  <Badge color="default" rounded="full" className="bg-primary/10 text-primary">
                    <Icon icon="icon-park-outline:dot" fontSize="12px" className="mr-1 text-inherit" />
                    {item.name}
                  </Badge>
                ))
              ) : (
                <p>No Packages</p>
              )}
            </div>
          ) : (
            <div className={`mt-4 flex w-full items-center justify-between`}>
              <div className="flex-1">
                <p className="text-xs md:text-sm">Ends on {endDateTimeformat}</p>
              </div>
              <div className="flex items-center gap-2">
                {reusedQuestionCount > 0 && (
                  <Button
                    size="icon"
                    className="relative h-7 w-7 rounded-full ring-1 ring-inset ring-default-300 hover:ring-default-300"
                    onClick={() => reusedquestionid(id)}
                  >
                    <Icon icon="iconoir:refresh-circle-solid" fontSize={26} className="text-primary" />

                    <Badge
                      color="destructive"
                      className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 rounded-full px-1.5 py-0.5 text-xs"
                    >
                      {reusedQuestionCount}
                    </Badge>
                  </Button>
                )}

                <div className="flex -space-x-2">
                  <div className="flex -space-x-2">
                    {faculties.slice(0, AVATAR_LIMIT).map((faculty, i) => (
                      <TooltipProvider key={i}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Avatar
                              key={i}
                              variant="default"
                              style={{ backgroundColor: generateColor(faculty.name) }}
                              className="h-7 w-7 rounded-full text-default ring-1 ring-default-300 ring-offset-background transition-all duration-300 hover:-translate-y-0.5"
                            >
                              <AvatarImage src={faculty.image_url} />
                              <AvatarFallback>{getInitials(faculty.name || '')}</AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent color="primary" side="bottom">
                            <p>{faculty.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}

                    {faculties.length > AVATAR_LIMIT && (
                      <Avatar
                        variant="default"
                        className="h-7 w-7 rounded-full ring-2 ring-inset ring-slate-300 hover:ring-slate-300"
                      >
                        <AvatarFallback>+{AVATAR_LIMIT - faculties.length}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default memo(ExamCard);
