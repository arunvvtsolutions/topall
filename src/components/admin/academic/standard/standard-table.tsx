'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { closestCenter, DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import StandardDraggableRow from './standard-draggable-row';
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { updateStandardOrder } from '@/utils/api/academic';
import { toast } from 'sonner';
import { FormFields, TosterMessages } from '@/types/enum';

interface TableProps {
  data: any[];
  columns: Array<{ header: string; accessor: keyof any }>;
  onDelete: (row: any) => void;
  onEdit: (row: any) => void;
  draggable: boolean;
  onShow: (row: any) => void;
}

const TableComponent = ({ data, columns, onDelete, onEdit, draggable, onShow }: TableProps) => {
  const [rows, setRows] = useState<any[]>(data);
  const [activeId, setActiveId] = useState<string | null>(null);

  const subjectIds = useMemo(() => rows.map((item) => item.id), [rows]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    setRows(data);
  }, [data]);

  //dragEndHandler
  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((row) => row.id === active.id);
    const newIndex = rows.findIndex((row) => row.id === over.id);
    const tentativeRows = arrayMove([...rows], oldIndex, newIndex);

    try {
      const standardIds = tentativeRows.map((row) => row.id);

      setRows(tentativeRows);
      await updateStandardOrder(standardIds);
      toast.success(TosterMessages.ADMIN_STD_UPDATE_SUCCESS);
    } catch (error) {
      toast.error(TosterMessages.ADMIN_STD_UPDATE_FAIL);
    }
  };

  //table header
  const renderTableHead = () => {
    return (
      <TableHeader className="text-B2Cblue sticky top-[-1px] z-10 rounded-t-xl border-b border-t bg-gray-50">
        <TableRow>
          {draggable && (
            <TableHead className="font-inter border-y border-border text-left text-sm font-medium text-primary"></TableHead>
          )}
          {columns.map((column, idx) => (
            <TableHead
              key={idx}
              className={`font-inter border-y border-border text-sm font-medium text-primary ${
                ['Image'].includes(column.header)
                  ? 'text-center'
                  : ['Status', 'Action'].includes(column.header)
                    ? 'text-right'
                    : 'text-left'
              } ${['Status'].includes(column.header) ? 'pr-4' : ''} ${
                ['Action'].includes(column.header) ? 'pr-12' : ''
              } normal-case`}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
    );
  };

  //table body
  const renderTableBody = () => {
    const totalColumns = draggable ? columns.length + 1 : columns.length;
    return (
      <TableBody>
        <SortableContext items={subjectIds} strategy={verticalListSortingStrategy}>
          {rows?.length > 0 ? (
            rows.map((row, index) => (
              <StandardDraggableRow
                key={index}
                row={row}
                index={index}
                draggable={draggable}
                onDelete={onDelete}
                onEdit={onEdit}
                onShow={onShow}
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
        <Table className="h-[20px] border-collapse rounded-[8px] rounded-b-sm border-borderad">
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
