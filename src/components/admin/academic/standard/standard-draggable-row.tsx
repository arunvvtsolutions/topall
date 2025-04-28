//table row
import { Icon } from '@/components/ui/icon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button, Button as SC_Button } from '@/components/ui/button';

//dnt kit
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CSSProperties } from 'react';

interface TableRowProps {
  row: any;
  index: number;
  draggable: boolean;
  onDelete: (row: any) => void;
  onEdit: (row: any) => void;
  onShow: (row: any) => void;
}

const StandardDraggableRow = ({ row, index, draggable, onEdit, onDelete, onShow }: TableRowProps) => {
  const { isDragging, attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: row.id });

  //style
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
    background: isDragging ? '#f3f4f6' : ''
  };

  return (
    <TableRow
      key={row.id}
      data-test-id={row?.id}
      style={style}
      ref={setNodeRef}
      className="font-inter border-b border-border text-left text-sm font-medium text-B2CAgrayn"
    >
      {draggable && (
        <TableCell className="w-2 text-center">
          <Button size="icon" variant="outline" className="cursor-grab" {...attributes} {...listeners}>
            <Icon icon={'material-symbols:drag-indicator'} className="text-2xl text-primary transition-all" />
          </Button>
        </TableCell>
      )}

      <TableCell className="ml-10 pl-8 text-left font-medium !text-[#4B4B4B]">{index + 1}</TableCell>
      <TableCell className="flex-nowrap pl-7 text-left font-semibold !text-[#4B4B4B]">
        <span
          onClick={() => onShow(row.id)}
          className="inline-flex cursor-pointer items-center whitespace-nowrap text-sm hover:text-primary hover:underline sm:text-sm md:text-sm lg:text-sm xl:text-base"
          data-test-id="standard-view-btn"
        >
          {row.name}
          <Icon icon={'si:chevron-right-alt-fill'} className="text-base transition-all" />
        </span>
      </TableCell>
      <TableCell className="font-inter px-12 text-left text-sm font-normal !text-[#4B4B4B]">{row.streams.id}</TableCell>
      <TableCell className="h=[40px] w-[47px] text-center">
        <Image
          src={row.image_file ? row.image_file : '/images/all-img/upload_image.svg'}
          alt="stream-image"
          width={50}
          height={50}
        />
      </TableCell>
      <TableCell className="px-1 text-right">
        <Badge className={`rounded-full text-right ${row.is_active ? 'bg-[#ECFDF3] text-Active' : 'text bg-[#F2F4F7]'}`}>
          <Icon icon={'stash:circle-duotone'} fontSize={'8PX'} className="mr-1 text-Active" />
          {row.is_active ? `Active` : 'Inactive'}
        </Badge>
      </TableCell>

      <TableCell className="text-right">
        <div className="items-right flex justify-end gap-2">
          <Button
            size="icon"
            onClick={() => onEdit(row.id)}
            className="mr-1 rounded-xl border border-border p-1 text-xs text-EditBut hover:bg-blue-200 sm:p-[5px] sm:text-xs md:p-1 md:text-base lg:p-2 lg:text-lg"
            data-testid="standard-delete-btn"
          >
            <Icon icon="rivet-icons:pencil-solid" fontSize={'16px'} />
          </Button>
          <Button
            size="icon"
            onClick={() => onDelete(row.id)}
            className="rounded-xl border border-border p-1 text-xs text-destructive hover:bg-red-200 sm:p-[5px] sm:text-sm md:p-1 md:text-base lg:p-[5px] lg:text-lg"
            data-testid="standard-delete-btn"
          >
            <Icon icon="mynaui:trash-solid" fontSize={'16px'} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default StandardDraggableRow;
