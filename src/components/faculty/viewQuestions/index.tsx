'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@/components/ui/icon';
import React, { CSSProperties, useMemo, useState } from 'react';
import QuestionCard from './QuestionCard';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { closestCenter, DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { ScrollArea } from '@/components/ui/scroll-area';
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type Option = {
  id: string;
  opt: string;
};

export type Question = {
  id: number;
  question: string;
  options: Option[];
  correctOption: string;
  solution: string;
  attemptedBy: number;
  correctBy: number;
  isSelected?: boolean;
};

const mockQuestions: Question[] = [
  {
    id: 1,
    question:
      'A balloon has 2 g of air. A small hole is pierced into it. The air comes out with a constant velocity of 4 m/s if the balloon shrinks completely in 2.5 s. The average force acting on the balloon is',
    options: [
      { id: 'a', opt: 'Distance' },
      { id: 'b', opt: 'Heat' },
      { id: 'c', opt: 'Angular momentum' },
      { id: 'd', opt: 'Energy' }
    ],
    correctOption: 'c',
    solution:
      'Using Newton’s second law, force is calculated as the rate of change of momentum. Since the mass and velocity are given, we can determine the force applied.',
    attemptedBy: 56,
    correctBy: 19
  },
  {
    id: 2,
    question:
      'When a 4 kg rifle is fired, the 10 g bullet receives an acceleration of 3×10² T. The force acting on the rifle (in newton) is',
    options: [
      { id: 'a', opt: 'Zero' },
      { id: 'b', opt: '100' },
      { id: 'c', opt: '300' },
      { id: 'd', opt: '3000' }
    ],
    correctOption: 'c',
    solution:
      'Using Newton’s third law, the force on the rifle is equal and opposite to the force on the bullet. The force can be calculated using F = ma, where mass and acceleration are given.',
    attemptedBy: 58,
    correctBy: 19
  },
  {
    id: 3,
    question: 'What is the SI unit of electric current?',
    options: [
      { id: 'a', opt: 'Ampere' },
      { id: 'b', opt: 'Volt' },
      { id: 'c', opt: 'Ohm' },
      { id: 'd', opt: 'Watt' }
    ],
    correctOption: 'a',
    solution: 'The SI unit of electric current is the ampere (A), which represents the flow of electric charge per second.',
    attemptedBy: 75,
    correctBy: 45
  },
  {
    id: 4,
    question: 'What is the chemical symbol for gold?',
    options: [
      { id: 'a', opt: 'Go' },
      { id: 'b', opt: 'Ag' },
      { id: 'c', opt: 'Au' },
      { id: 'd', opt: 'Pb' }
    ],
    correctOption: 'c',
    solution: "The chemical symbol for gold is 'Au', derived from the Latin word 'Aurum'.",
    attemptedBy: 80,
    correctBy: 60
  },
  {
    id: 5,
    question: 'What is the speed of light in vacuum?',
    options: [
      { id: 'a', opt: '3 × 10⁶ m/s' },
      { id: 'b', opt: '3 × 10⁸ m/s' },
      { id: 'c', opt: '3 × 10⁵ m/s' },
      { id: 'd', opt: '3 × 10⁷ m/s' }
    ],
    correctOption: 'b',
    solution: 'The speed of light in vacuum is approximately 3 × 10⁸ meters per second.',
    attemptedBy: 90,
    correctBy: 75
  },
  {
    id: 6,
    question: 'Which planet is known as the Red Planet?',
    options: [
      { id: 'a', opt: 'Earth' },
      { id: 'b', opt: 'Mars' },
      { id: 'c', opt: 'Jupiter' },
      { id: 'd', opt: 'Venus' }
    ],
    correctOption: 'b',
    solution: 'Mars is known as the Red Planet due to its reddish appearance caused by iron oxide (rust) on its surface.',
    attemptedBy: 85,
    correctBy: 70
  },
  {
    id: 7,
    question: 'Who proposed the theory of relativity?',
    options: [
      { id: 'a', opt: 'Isaac Newton' },
      { id: 'b', opt: 'Albert Einstein' },
      { id: 'c', opt: 'Galileo Galilei' },
      { id: 'd', opt: 'Niels Bohr' }
    ],
    correctOption: 'b',
    solution: 'Albert Einstein proposed the theory of relativity, which includes special and general relativity.',
    attemptedBy: 78,
    correctBy: 65
  },
  {
    id: 8,
    question: "What is the most abundant gas in Earth's atmosphere?",
    options: [
      { id: 'a', opt: 'Oxygen' },
      { id: 'b', opt: 'Carbon Dioxide' },
      { id: 'c', opt: 'Nitrogen' },
      { id: 'd', opt: 'Argon' }
    ],
    correctOption: 'c',
    solution: "Nitrogen makes up about 78% of Earth's atmosphere, making it the most abundant gas.",
    attemptedBy: 88,
    correctBy: 73
  },
  {
    id: 9,
    question: 'What is the powerhouse of the cell?',
    options: [
      { id: 'a', opt: 'Nucleus' },
      { id: 'b', opt: 'Mitochondria' },
      { id: 'c', opt: 'Ribosome' },
      { id: 'd', opt: 'Golgi apparatus' }
    ],
    correctOption: 'b',
    solution: "Mitochondria are known as the powerhouse of the cell because they generate ATP, the cell's energy currency.",
    attemptedBy: 92,
    correctBy: 80
  },
  {
    id: 10,
    question: 'What is the chemical formula for water?',
    options: [
      { id: 'a', opt: 'CO₂' },
      { id: 'b', opt: 'H₂O' },
      { id: 'c', opt: 'O₂' },
      { id: 'd', opt: 'NaCl' }
    ],
    correctOption: 'b',
    solution: 'The chemical formula for water is H₂O, consisting of two hydrogen atoms and one oxygen atom.',
    attemptedBy: 98,
    correctBy: 90
  }
];

const ViewQuestionTitle = ({
  rows,
  setRows
}: {
  rows: Question[];
  setRows: React.Dispatch<React.SetStateAction<Question[]>>;
}) => {
  const handleSelectAll = (checked: boolean) => {
    if (checked) setRows((prev) => prev.map((row) => ({ ...row, isSelected: true })));
    else setRows((prev) => prev.map((row) => ({ ...row, isSelected: false })));
  };
  return (
    <div className="flex items-center justify-between rounded-[8px] border border-[.5px] border-[#000080] bg-[#F4F4F8] p-[15px]">
      <div className="flex flex-row flex-nowrap items-center justify-center gap-[10px]">
        <Checkbox onCheckedChange={handleSelectAll} />
        <p className="text-[16px] font-[500] text-[#000080]">Select All Questions</p>
      </div>
      <Button className="flex h-max w-max gap-[2.5px] rounded-[6px] border border-[#10101026] !px-[13px] !py-[5px]">
        <Icon icon="material-symbols-light:delete-outline" className="h-5 w-5 text-[#FF4747]" />
        <p className="text-[12px] font-[700]">Delete Questions</p>
      </Button>
    </div>
  );
};

const ViewQuestions = () => {
  const [rows, setRows] = useState(mockQuestions);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const questionIds = useMemo(() => rows.map((item) => item.id), [rows]);

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((row) => row.id === active.id);
    const newIndex = rows.findIndex((row) => row.id === over.id);
    const tentativeRows = arrayMove([...rows], oldIndex, newIndex);
    try {
      // const payload = {
      //   subjectIds: tentativeRows.map((row) => row.id)
      // };
      setRows(tentativeRows);
      // await updateSubjectOrder(payload);
      // toast.success(TosterMessages.ADMIN_SUB_UPDATE_SUCCESS);
    } catch (error) {
      // toast.error(TosterMessages.ADMIN_SUB_UPDATE_FAIL);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col !px-[56px] !py-[32px]">
        <ViewQuestionTitle rows={rows} setRows={setRows} />
        <div className="mt-[15px] flex flex-col gap-[15px]">
          <Accordion type="single" collapsible className="w-full">
            <SortableContext items={questionIds} strategy={verticalListSortingStrategy}>
              {rows.map((row, index) => {
                return <QuestionCard key={index} row={row} index={index} />;
              })}
            </SortableContext>
          </Accordion>
        </div>
      </div>
    </DndContext>
  );
};

export default ViewQuestions;
