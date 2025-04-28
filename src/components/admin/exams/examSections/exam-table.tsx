'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ExameSection } from '@/types';
import DraggableRow from './table-row';

interface TableProps {
  data: any;
  columns: Array<{ header: string; accessor: keyof any }>;
}

const ExamtableComponent = ({ data, columns }: TableProps) => {
  const [rows, setRows] = useState<ExameSection[]>(data);

  const examsIds = useMemo(() => rows.map((item) => item.id), [rows]);

  useEffect(() => {
    setRows(data);
  }, [data]);

  //table header
  const renderTableHead = () => {
    return (
      <TableHeader className="text-B2Cblue rounded-t-xl bg-headingclor">
        <TableRow className="sticky top-0 z-10">
          {columns.map((column, idx) => (
            <TableHead
              key={idx}
              className={`font-inter !h-10 border-y-[0.2px] border-borderad pr-1 text-sm font-medium normal-case text-primary ${
                ['Instructions', 'Total Question', 'Reused Count'].includes(column.header) ? 'text-center' : 'text-left'
              } `}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
    );
  };

  const renderTableBody = () => {
    return (
      <TableBody>
        <SortableContext items={examsIds} strategy={verticalListSortingStrategy}>
          {rows?.length > 0 ? (
            rows.map((row, index) => <DraggableRow key={index} row={row} index={index} />)
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center">
                No Data Found
              </TableCell>
            </TableRow>
          )}
        </SortableContext>
      </TableBody>
    );
  };

  return (
    <ScrollArea className="h-[395px] border-[0.5px]" type="scroll">
      <Table className="h-[200px] border-collapse rounded-[8px] rounded-b-sm">
        {renderTableHead()}
        {renderTableBody()}
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default ExamtableComponent;
