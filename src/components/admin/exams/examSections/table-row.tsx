import { TableCell, TableRow } from '@/components/ui/table';
import { useSortable } from '@dnd-kit/sortable';

interface TableRowProps {
  row: any;
  index: number;
  showActions?: boolean;
  draggable?: boolean;
}

const DraggableRow = ({ row, index }: TableRowProps) => {
  const { setNodeRef } = useSortable({ id: row.id });

  return (
    <TableRow
      key={row.id}
      data-test-id={row?.id}
      ref={setNodeRef}
      className="font-inter !h-0 border-y-[0.5px] border-borderad text-center text-sm font-medium"
    >
      <TableCell className="!h-11 whitespace-nowrap pl-8 text-left text-sm font-medium text-B2CAgrayn">{index + 1}</TableCell>

      <TableCell className="font-inter !h-11 whitespace-nowrap px-6 text-left text-sm font-semibold text-B2CAgray sm:text-sm md:text-xs lg:text-sm xl:text-sm">
        {row.subjectName}
      </TableCell>
      <TableCell className="font-inter !h-11 whitespace-nowrap text-left text-sm font-semibold text-B2CAgray">
        {row.name}
      </TableCell>
      <TableCell className="font-inter !h-11 whitespace-nowrap text-center text-sm font-normal text-B2CAgray">
        {row.totalQuestions}
      </TableCell>
      <TableCell className="font-inter !h-11 whitespace-nowrap text-center text-sm font-normal text-destructive">
        {row.reusedQuestionCount}
      </TableCell>
    </TableRow>
  );
};

export default DraggableRow;
