import React from 'react';
import { Edit, Archive, Trash2, RotateCcw, ArchiveRestore } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plan } from './mock-data';
import { ButtonNames, IPackagePlan } from '@/types/enum';
import Link from 'next/link';

interface PlanCardProps {
  plan: IPackagePlan;
  isArchiveTab: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onArchiveUnarchive: (id: number, archive: boolean) => void;
  stream: any;
}

export function PlanCard({ plan, isArchiveTab, onEdit, onDelete, onArchiveUnarchive, stream }: PlanCardProps) {
  return (
    <Card className="flex h-[250px] w-full flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {isArchiveTab ? (
              <div className="truncate text-sm font-semibold text-[#222222] md:text-base">
                <h3 className="truncate">{plan.title}</h3>
              </div>
            ) : (
              <Link
                href={{
                  pathname: `/admin/packages/${plan.id}`,
                  query: { streamId: stream?.streamId, planId: plan.id, title: plan.title }
                }}
                className="truncate text-sm font-semibold text-[#222222] md:text-base"
              >
                <h3 className="truncate">{plan.title}</h3>
              </Link>
            )}

            <Icon icon={'si:chevron-right-alt-fill'} className="size-5 shrink-0 text-base transition-all" />
          </div>

          <div>
            {isArchiveTab && (
              <Badge className="rounded-full bg-[#F1F5F9] text-xs font-medium text-[#475569]">{stream.streamName}</Badge>
            )}

            {!isArchiveTab && plan.isActive && (
              <Badge className="rounded-full bg-[#ECFDF3] text-xs font-medium text-[#00A86B]">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#00A86B]"></span>
                ACTIVE
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow pb-0">
        <div className="mb-3 max-w-full overflow-hidden">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mb-3 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {plan.standardList.map((std, index) => (
                    <span key={index} className="inline-flex items-center gap-1">
                      <Badge className="px-0 text-xs font-medium text-[#4B4B4B] md:text-sm">{std.name}</Badge>
                      {index < plan.standardList.length - 1 && (
                        <Separator orientation="vertical" className="mx-1 h-4 bg-B2CAgray/50" />
                      )}
                    </span>
                  ))}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start">
                {plan.standardList.map((std) => std.name).join(' | ')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="mb-3 max-h-[100px] overflow-y-auto">
          <p className="line-clamp-3 text-sm font-normal text-[#4B4B4B]">{plan.description}</p>
        </div>
      </CardContent>

      <div className="px-6 py-3">
        <Separator className="mb-auto" />
      </div>

      <div className="flex justify-evenly gap-2 px-6 pb-3">
        {isArchiveTab ? (
          <Button
            variant="default"
            color="secondary"
            size="sm"
            className="flex items-center gap-1 rounded-2xl border border-borderad bg-transparent text-xs text-[#4B4B4B]"
            onClick={() => onArchiveUnarchive(plan?.id, false)}
          >
            <ArchiveRestore className="h-3.5 w-3.5" />
            {ButtonNames.UNARCHIVE}
          </Button>
        ) : (
          <Button
            variant="default"
            color="secondary"
            size="sm"
            className="flex items-center gap-1 rounded-2xl border border-borderad bg-transparent text-xs text-[#4B4B4B]"
            onClick={() => onArchiveUnarchive(plan?.id, true)}
          >
            <Archive className="h-3.5 w-3.5" />
            {ButtonNames.ARCHIVE}
          </Button>
        )}

        {!isArchiveTab && (
          <Button
            variant="default"
            color="secondary"
            size="sm"
            className="flex items-center gap-1 rounded-2xl border border-borderad bg-transparent text-xs text-[#4B4B4B]"
            onClick={() => onEdit(plan?.id)}
          >
            <Edit className="h-3.5 w-3.5" />
            {ButtonNames.EDIT}
          </Button>
        )}

        {!isArchiveTab && (
          <Button
            onClick={() => onDelete(plan?.id)}
            variant="default"
            color="secondary"
            size="sm"
            className="relative flex items-center gap-1 rounded-2xl border border-borderad bg-transparent text-xs text-[#4B4B4B]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {ButtonNames.DELETE}
          </Button>
        )}
      </div>

      {/* <div className="flex h-8 w-12 items-center justify-center">
          {plan.notifications > 0 && (
            <div className="relative flex items-center justify-center">
              <div className="flex size-8 items-center justify-center rounded-full border bg-white shadow-lg">
                <span className="rounded-full bg-primary">
                  <Icon icon="solar:users-group-rounded-bold" className="size-5 text-white" />
                </span>
              </div>

              <span className="absolute -right-1 -top-1.5 flex size-4 items-center justify-center rounded-full bg-[#FF4747] text-xs font-bold text-white shadow-md">
                {plan.notifications}
              </span>
            </div>
          )}
        </div> */}
    </Card>
  );
}
