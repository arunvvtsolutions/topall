'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';

import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import DraggableRow from './draggable-row';
import PaswordConfirmationModal from '@/components/common/password-confirmation-modal';
import { updateSyllabusLinkOrder } from '@/utils/api/academic';
import { toast } from 'sonner';
import { FormFields, TosterMessages } from '@/types/enum';

interface TableProps {
  data: any[];
  columns: Array<{ header: string; accessor: keyof any }>;
  draggable: boolean;
  onShow: (id: number) => void;
  onLink: (row: any) => void;
}

const TableComponent = ({ data, columns, draggable, onShow, onLink }: TableProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rows, setRows] = useState<any[]>([]);

  const syllabusIds = useMemo(() => rows.map((item) => item.id), [rows]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  //dragEndHandler
  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((row) => row.id === active.id);
    const newIndex = rows.findIndex((row) => row.id === over.id);
    const tentativeRows = arrayMove(rows, oldIndex, newIndex);

    try {
      const syllabusIds = tentativeRows.map((row) => row.id);
      setRows(tentativeRows);
      await updateSyllabusLinkOrder(syllabusIds);
      toast.success(TosterMessages.ADMIN_SYLLABUS_UPDATE_SUCCESS);
    } catch (error) {
      console.log('error', error);
      toast.error(TosterMessages.ADMIN_SYLLABUS_UPDATE_FAIL);
    }
  };

  // Password Confirm Handler
  const PasswordConfirm = async () => {
    setShowPassword(false);
  };

  // open passord Handler
  const clikhandeler = () => {
    setShowPassword(true);
  };

  useEffect(() => {
    setRows(data);
  }, [data]);

  //table header
  const renderTableHead = () => {
    return (
      <TableHeader className="text-B2Cblue sticky top-[-1px] z-10 rounded-t-xl border-b border-t bg-gray-50">
        <TableRow>
          {draggable && (
            <TableHead className="font-inter border-y border-border text-center text-sm font-medium text-primary"></TableHead>
          )}
          {columns.map((column, idx) => (
            <TableHead
              key={idx}
              className={`font-base border-y border-border text-sm font-medium text-primary ${
                ['Chapter And Topic', 'Status'].includes(column.header) ? 'text-center' : 'text-left'
              } ${['Action'].includes(column.header) ? 'pr-12' : ''} normal-case`}
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
        <SortableContext items={syllabusIds} strategy={verticalListSortingStrategy}>
          {rows?.length > 0 ? (
            rows.map((row, index) => (
              <DraggableRow key={index} row={row} index={index} onLink={onLink} onShow={onShow} draggable={draggable} />
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
    <>
      <DndContext
        sensors={sensors}
        modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <ScrollArea className="h-[395px]" type="scroll">
          <Table className="h-[201px] border-collapse overflow-y-auto rounded-[8px] rounded-b-sm border-borderad">
            {renderTableHead()}
            {renderTableBody()}
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DndContext>

      {showPassword && (
        <PaswordConfirmationModal open={showPassword} onConfirm={PasswordConfirm} onClose={() => setShowPassword(false)} />
      )}
    </>
  );
};

export default TableComponent;
