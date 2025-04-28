//table row
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button, Button as SC_Button } from '@/components/ui/button';
//dnt kit
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CSSProperties, useEffect, useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { testTypeStatusToggle } from '@/utils/api/academic';
import { toast } from 'sonner';
import { TosterMessages } from '@/types/enum';
import { Testtype } from '@/types';
import { FormType } from '@/types/enum';
interface TableRowProps {
  row: Testtype;
  index: number;
  showActions: boolean;
  draggable: boolean;
  onConform: () => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, type: FormType) => void;
  onShow: (row: number, type: FormType) => void;
  onInstruction: (id: number) => void;
}

const DraggableRow = ({ row, index, onEdit, draggable, onInstruction, onShow, showActions, onDelete }: TableRowProps) => {
  const [checked, setChecked] = useState<boolean>(row.leader_board);
  const { isDragging, attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: row.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
    background: isDragging ? '#f3f4f6' : ''
  };

  const onStatusChange = async (id: number, status: boolean) => {
    // API call
    try {
      const response = await testTypeStatusToggle(id, { leaderBoardStatus: status });

      if (response?.statusCode !== 200) {
        toast.error(TosterMessages.LEADER_BOARD_UPDATE_FAIL);
        return;
      }
      setChecked(!checked);
      toast.success(TosterMessages.LEADER_BOARD_UPDATE);
    } catch (error) {
      toast.error(TosterMessages.LEADER_BOARD_UPDATE_ERR);
    }
  };

  useEffect(() => {
    setChecked(row.leader_board);
  }, [row.leader_board]);

  return (
    <TableRow
      key={row.id}
      data-test-id={row?.id}
      style={style}
      ref={setNodeRef}
      className="font-inter border-b border-border text-center text-sm font-medium"
    >
      {draggable && (
        <TableCell className="w-2 text-center">
          <Button size="icon" variant="outline" className="cursor-grab" {...attributes} {...listeners}>
            <Icon icon={'material-symbols:drag-indicator'} className="text-2xl text-primary transition-all" />
          </Button>
        </TableCell>
      )}

      <TableCell className="pl-8 text-left text-sm font-medium !text-[#4B4B4B]">{index + 1}</TableCell>
      <TableCell className="flex-nowrap pt-0 text-left font-semibold !text-[#4B4B4B]">
        <span
          onClick={() => onShow(row.id, FormType.VIEW)}
          className="inline-flex cursor-pointer items-center whitespace-nowrap text-sm hover:text-primary hover:underline sm:text-sm md:text-sm lg:text-sm xl:text-base"
          data-test-id="test-type-view-btn"
        >
          {row.streams !== null ? (
            <>
              {row.streams.name}
              <Icon icon="si:chevron-right-alt-fill" className="text-base transition-all" />
            </>
          ) : (
            '-'
          )}
        </span>
      </TableCell>
      <TableCell className="font-inter whitespace-nowrap px-6 text-left text-sm font-normal !text-[#4B4B4B] sm:text-sm md:text-xs lg:text-sm xl:text-sm">
        {row.test_type_list.name}
      </TableCell>
      <TableCell className="font-inter px-12 text-left text-sm font-normal !text-[#4B4B4B]">
        {row.stream_id ? row.stream_id : '-'}
      </TableCell>

      <TableCell className="flex h-full items-center justify-center text-center">
        <Button className="flex h-8 rounded-lg border p-2 py-1" onClick={() => onInstruction(row.id)}>
          <Icon icon="heroicons:plus-circle-16-solid" className="mr-2 size-4 text-[#0F9D58]" />
          <span className="text-xs font-normal text-gray-600">Add/Edit</span>
        </Button>
      </TableCell>
      <TableCell className="h-[40px] w-[47px] items-center justify-center text-center">
        <div>
          <Image
            src={row.image_file ? row.image_file : '/images/all-img/upload_image.svg'}
            alt="stream-image"
            width={50}
            height={50}
          />
        </div>
      </TableCell>
      <TableCell className="text-center">
        <Switch
          onCheckedChange={() => onStatusChange(row.id, !checked)}
          className="data-[state=checked]:bg-Active"
          checked={checked}
        />
      </TableCell>

      <TableCell className="text-center">
        <Badge className={`rounded-full text-right ${row.is_active ? 'bg-[#ECFDF3] text-Active' : 'bg-[#F2F4F7] text-gray-600'}`}>
          <Icon icon={'stash:circle-duotone'} fontSize={'8PX'} className="mr-1" />
          {row.is_active ? `Active` : 'Inactive'}
        </Badge>
      </TableCell>
      {showActions && (
        <TableCell className="text-center">
          <div className="items-right flex justify-end gap-1">
            <Button
              onClick={() => onEdit(row.id, FormType.EDIT)}
              size="icon"
              className="mr-1 rounded-xl border border-border p-1 text-xs text-EditBut hover:bg-blue-200 sm:p-[5px] sm:text-xs md:p-1 md:text-base lg:p-2 lg:text-lg"
              data-testid="testType-edit-btn"
            >
              <Icon icon="rivet-icons:pencil-solid" fontSize={'16px'} />
            </Button>
            <Button
              size="icon"
              onClick={() => onDelete(row.id)}
              className="rounded-xl border border-border p-1 text-xs text-destructive hover:bg-red-200 sm:p-[5px] sm:text-sm md:p-1 md:text-base lg:p-2 lg:text-lg"
              data-testid="testType-delete-btn"
            >
              <Icon icon="mynaui:trash-solid" fontSize={'16px'} />
            </Button>
          </div>
          {/* rounded-full border border-border text-xs text-blue-600 hover:bg-blue-200 sm:p-[5px] sm:text-xs md:p-1 md:text-base lg:p-[5px] lg:text-lg" */}
        </TableCell>
      )}
    </TableRow>
  );
};

export default DraggableRow;
