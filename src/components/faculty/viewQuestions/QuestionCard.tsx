import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { useSortable } from '@dnd-kit/sortable';
import React, { CSSProperties } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Question } from '.';
import { cn } from '@/lib/utils';

const QuestionCard = ({ row, index }: { row: Question; index: number }) => {
  const { isDragging, attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: row.id });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
    background: isDragging ? '#f3f4f6' : ''
  };
  return (
    <AccordionItem
      value="item-1"
      style={style}
      ref={setNodeRef}
      className={cn(
        'flex h-full flex-row items-center !justify-center gap-[0px] rounded-[9px] bg-[#FFFFFF]',
        row.isSelected && 'border-[#000080]'
      )}
    >
      <div className="flex h-full w-full max-w-[40px] items-center justify-center">
        <Button
          size="icon"
          variant="outline"
          className="my-auto h-max w-max cursor-grab border-none !p-0"
          {...attributes}
          {...listeners}
        >
          <Icon icon={'material-symbols:drag-indicator'} className="text-2xl text-primary transition-all" />
        </Button>
      </div>
      <div className="h-full w-full border-l pr-[15px]">
        <AccordionTrigger className="h-full justify-start !p-0">
          <div className="grid !h-full w-full grid-cols-12 grid-rows-1 flex-row flex-nowrap justify-between gap-1 py-[15px]">
            <div className="col-span-9 flex flex-row flex-nowrap">
              <div className="h-full px-[10px]">
                <div className="rounded-[8px] bg-[#F3F4F7] px-[16px] py-[9px]">{index + 1}</div>
              </div>
              <div className="flex flex-col">
                <p className="text-start text-[16px] font-[500] leading-[24px]">{row.question}</p>
                <div className="mt-[35px] flex flex-wrap items-center justify-between gap-[15px]">
                  {row.options.map((opt) => {
                    return (
                      <div className="flex flex-nowrap items-center justify-center gap-[6px]">
                        <div
                          className={cn(
                            'flex h-[31px] w-[31px] items-center justify-center rounded-[6px] border text-[#222222]',
                            opt.id === row.correctOption ? 'bg-[#000080] text-[#fff]' : ''
                          )}
                        >
                          {opt.id.toUpperCase()}
                        </div>
                        <p className="text-start text-[16px] font-[500] text-[#4B4B4B]">{opt.opt}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="col-span-3 col-start-10 flex h-full flex-row items-start justify-center">
              <div className="flex !h-full flex-col items-center justify-between">
                <div className="flex max-h-max w-full flex-wrap items-start justify-end gap-[8px]">
                  <Button className="flex h-max w-max gap-[2.5px] rounded-[6px] border border-[#10101026] !px-[10px] !py-[5px]">
                    <Icon icon="solar:history-bold" className="h-5 w-5 text-[#000080]" />
                    <p className="hidden text-[12px] font-[700] xl:block">Usage History</p>
                  </Button>
                  <Button className="flex h-max w-max gap-[2.5px] rounded-[6px] border border-[#10101026] !px-[13px] !py-[5px]">
                    <Icon icon="material-symbols-light:delete-outline" className="h-5 w-5 text-[#FF4747]" />
                    <p className="hidden text-[12px] font-[700] xl:block">Delete</p>
                  </Button>
                  <Button className="flex h-max w-max gap-[2.5px] rounded-[6px] border border-[#E317171A] bg-[#E317171A] !px-[13px] !py-[5px]">
                    <Icon icon="carbon:warning" className="h-5 w-5 text-[#FF4747]" />
                    <p className="hidden text-[12px] font-[700] xl:block">Report</p>
                  </Button>
                </div>
                <div className="mt-[35px] flex max-h-max w-full flex-wrap items-start justify-end gap-[8px]">
                  <div className="rounded-[5px] bg-[#000080] px-[10px] py-[2px] text-[11px] font-[500] leading-[20px] text-[#FFFFFF]">
                    Attempted by {row.attemptedBy}%
                  </div>
                  <div className="rounded-[5px] bg-[#00A86B] px-[10px] py-[2px] text-[11px] font-[500] leading-[20px] text-[#FFFFFF]">
                    Correct by {row.correctBy}%
                  </div>
                  <div className="rounded-[5px] bg-[#000080] px-[10px] py-[2px] text-[11px] font-[500] leading-[20px] text-[#FFFFFF]">
                    {row.id}
                  </div>
                  <div className="rounded-[5px] bg-[#00A86B] px-[10px] py-[2px] text-[11px] font-[500] leading-[20px] text-[#FFFFFF]">
                    E
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Icon icon={'solar:alt-arrow-down-bold'} className="text-2xl text-primary transition-all" />
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-[15px]">
          <div className="broder ml-[35px] rounded-[9px] border-[.5px] border-[#10101026] px-[15px] py-[10px]">
            <h1 className="text-[16px] font-[700] text-[#222222]">Solution: </h1>
            <p className="mt-[5px] text-[14px] font-[500] leading-[24px]">{row.solution}</p>
          </div>
        </AccordionContent>
      </div>
    </AccordionItem>
  );
};

export default QuestionCard;
