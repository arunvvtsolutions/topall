//table row
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button, Button as SC_Button } from '@/components/ui/button';
//dnt kit
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CSSProperties } from 'react';
import { Icon } from '@/components/ui/icon';
import { toast } from 'sonner';
import { TosterMessages } from '@/types/enum';

interface TableRowProps {
  row: any;
  index: number;
  draggable: boolean;
  onShow: (id: number) => void;
  onLink: (data: any) => void;
}

const DraggableRow = ({ row, index, draggable, onShow, onLink }: TableRowProps) => {
  const { isDragging, attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: row.id });

  // Style for draggable row
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
    background: isDragging ? '#f3f4f6' : ''
  };

  // Modified onShow handler to check qbank_subject_id
  const handleShow = () => {
    if (row.qbank_subject_id) {
      onShow(row.id);
    } else {
      toast.info(TosterMessages.ADMIN_SYLLABUS_CANT_VIEW);
    }
  };

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
          onClick={handleShow}
          className="inline-flex cursor-pointer items-center whitespace-nowrap text-sm hover:text-primary hover:underline sm:text-sm md:text-sm lg:text-sm xl:text-base"
          data-test-id="syllabus-viwe-btn"
        >
          {row.subjects.name}
          <Icon icon={'si:chevron-right-alt-fill'} className="text-base transition-all" />
        </span>
      </TableCell>
      <TableCell className="font-inter px-6 text-left text-sm font-normal !text-[#4B4B4B]">{row.streams.name}</TableCell>
      <TableCell className="font-inter px-6 text-left text-sm font-normal !text-[#4B4B4B]">{row.standard.name}</TableCell>
      <TableCell className="font-inter px-6 text-center text-sm font-normal">
        <Button
          size="sm"
          onClick={() => onLink(row)}
          className="text-'#4B4B4B' m-2 w-[110px] rounded-[10px] border border-border border-borderButton px-1 py-1 text-center text-xs font-normal"
          data-testid="link/unlink-btn"
        >
          <div>
            <Icon icon="ant-design:link-outlined" className="mr-1 text-lg text-primary" />
          </div>
          link/unlink
        </Button>
      </TableCell>
      <TableCell className="text-center">
        <Badge className={`rounded-full text-right ${row.is_active ? 'bg-[#ECFDF3] text-Active' : 'bg-[#F2F4F7] text-gray-600'}`}>
          <Icon icon={'stash:circle-duotone'} fontSize={'8PX'} className="mr-1" />
          {row.is_active ? `Active` : 'Inactive'}
        </Badge>
      </TableCell>
    </TableRow>
  );
};

export default DraggableRow;
