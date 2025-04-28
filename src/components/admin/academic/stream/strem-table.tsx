import React, { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { closestCenter, DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import DraggableRow from './draggable-row';
import { restrictToVerticalAxis, restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';
import DeleteConfirmationDialog from '@/components/delete-confirmation-dialog';

// import { updateStreamsOrder, updateSubjectOrder } from '@/utils/api/academic';
import { FormFields, FormType, TosterMessages } from '@/types/enum';
import { toast } from 'sonner';
import { updateStreamOrder } from '@/utils/api/academic';
interface TableProps {
  data: any[];
  columns: Array<{ header: string; accessor: keyof any }>;
  onDelete: (id: number) => void;
  onEdit: (id: number, type: FormType) => void;
  onRowReorder: (newData: any[]) => void;
  draggable?: boolean;
  showActions?: boolean;
}

const TableComponent = ({ data, columns, onDelete, onEdit, onRowReorder, showActions, draggable = true }: TableProps) => {
  const [rows, setRows] = useState<any[]>(data);

  const streamIds = useMemo(() => rows.map((item) => item.id), [rows]);

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
      const payload = {
        streamIds: tentativeRows.map((row) => row.id)
      };
      setRows(tentativeRows);
      await updateStreamOrder(payload);
      toast.success(TosterMessages.ADMIN_STREAM_UPDATE_SUCCESS);
    } catch (error) {
      toast.error(TosterMessages.ADMIN_STREAM_UPDATE_FAIL);
    }
  };

  //table header
  const renderTableHead = () => {
    return (
      <TableHeader className="text-B2Cblue sticky top-[-1px] z-10 rounded-t-xl border-b border-t bg-gray-50">
        <TableRow>
          {draggable && <TableHead className="font-inter p-0 text-center text-sm font-medium text-primary"></TableHead>}
          {columns.map((column, idx) => (
            <TableHead
              key={idx}
              className={`font-inter border-y border-border text-sm font-medium text-primary ${
                ['Image'].includes(column.header)
                  ? 'text-center'
                  : ['Status', 'Action'].includes(column.header)
                    ? 'text-right'
                    : 'text-left'
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
        <SortableContext items={rows} strategy={verticalListSortingStrategy}>
          {rows?.length > 0 ? (
            rows.map((row, index) => (
              <DraggableRow key={index} row={row} index={index} onDelete={onDelete} onEdit={onEdit} showActions draggable />
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
        <ScrollArea className="h-[395px] border" type="scroll">
          <Table className="h-[200px] border-collapse overflow-y-auto rounded-[8px] rounded-b-sm border-borderad">
            {renderTableHead()}
            {renderTableBody()}
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DndContext>
    </>
  );
};

export default TableComponent;
