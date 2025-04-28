'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { closestCenter, DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';

import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import DraggableRow from './draggable-row';
import { FormFields, FormType, TosterMessages } from '@/types/enum';
import { toast } from 'sonner';
import { updateTesttypeSequence } from '@/utils/api/academic';
import { Testtype } from '@/types';

interface TableProps {
  data: Testtype[];
  columns: Array<{ header: string; accessor: keyof any }>;
  onDelete: (row: number) => void;
  onEdit: (id: number, type: FormType) => void;
  onRowReorder: (newData: any[]) => void;
  draggable: boolean;
  showActions?: boolean;
  onShow: (row: number, type: FormType) => void;
  onInstruction: (id: number) => void;
}

const TableComponent = ({ data, columns, onDelete, onEdit, onShow, onInstruction, showActions, draggable }: TableProps) => {
  const [rows, setRows] = useState<Testtype[]>(data);

  const testTypeIds = useMemo(() => rows.map((item) => item.id), [rows]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    setRows(data);
  }, [data]);

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((row) => row.id === active.id);
    const newIndex = rows.findIndex((row) => row.id === over.id);
    const tentativeRows = arrayMove([...rows], oldIndex, newIndex);

    try {
      const testTypeIds = tentativeRows.map((row) => row.id);

      setRows(tentativeRows);

      await updateTesttypeSequence(testTypeIds);
      toast.success(TosterMessages.ADMIN_SUB_TEST_SUCCESS);
    } catch (error) {
      toast.error(TosterMessages.ADMIN_TEST_FAIL);
    }
  };

  //table header
  const renderTableHead = () => {
    return (
      <TableHeader className="text-B2Cblue sticky top-[-1px] z-10 rounded-t-xl border-b border-t bg-gray-50">
        <TableRow className="">
          {draggable && (
            <TableHead className="font-inter border-y border-border text-left text-sm font-medium text-primary"></TableHead>
          )}
          {columns.map((column, idx) => (
            <TableHead
              key={idx}
              className={`font-inter border-y border-border px-6 text-sm font-medium normal-case text-primary ${
                ['Status', 'Image', 'Instructions', 'Leaderboard for Tests'].includes(column.header)
                  ? 'text-center'
                  : ['Action'].includes(column.header)
                    ? 'text-right'
                    : 'text-left'
              } ${['Action'].includes(column.header) ? 'pr-12' : ''} ${
                ['Leaderboard for Tests'].includes(column.header) ? 'text-wrap' : ''
              } normal-case`}
            >
              {column.header === 'Leaderboard for Tests' ? (
                <span className="block">
                  Leaderboard <br /> for Tests
                </span>
              ) : (
                column.header
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
    );
  };

  const renderTableBody = () => {
    const totalColumns = draggable ? columns.length + 1 : columns.length;
    return (
      <TableBody>
        <SortableContext items={testTypeIds} strategy={verticalListSortingStrategy}>
          {rows?.length > 0 ? (
            rows.map((row, index) => (
              <DraggableRow
                key={index}
                row={row}
                index={index}
                showActions
                draggable={draggable}
                onShow={onShow}
                onEdit={onEdit}
                onDelete={onDelete}
                onInstruction={onInstruction}
                onConform={() => ''}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={totalColumns} className="h-[335px] text-center">
                <div className="flex h-full items-center justify-center">
                  <span className="!font-semibold !text-[#4B4B4B]">{FormFields.NO_DATA_MSG || 'No data found'}</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </SortableContext>
      </TableBody>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <ScrollArea className="h-[395px] border" type="scroll">
        <Table className="h-[200px] border-collapse rounded-[8px] rounded-b-sm border-borderad">
          {renderTableHead()}
          {renderTableBody()}
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {/* <div className="max-h-[600px] overflow-x-auto overflow-y-auto"></div> */}
    </DndContext>
  );
};

export default TableComponent;
