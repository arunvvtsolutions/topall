import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { StudentPurchase } from '@/types';

const formatDate = (isoDate: string) => {
  return format(new Date(isoDate), 'MM/dd/yyyy hh:mm a');
};

export const useTableColumns = () => {
  return useMemo<ColumnDef<StudentPurchase>[]>(
    () => [
      {
        accessorKey: 'id',
        // header: 'SI NO',
        header: () => <div className="text-center text-xs font-medium text-[#222222] md:text-sm">SI NO</div>,
        cell: ({ row }) => <div className="text-center text-xs font-medium text-[#222222] md:text-sm">{row.getValue('id')}</div>
      },
      {
        accessorKey: 'name',
        header: () => <div className="text-xs font-medium text-[#222222] md:text-sm">STUDENT NAME</div>,
        cell: ({ row }) => (
          <div>
            <div className="text-xs font-normal text-[#222222] md:text-sm">{row.getValue('name')}</div>
            <div className="text-[11px] text-[#222222] md:text-[13px]">{row.original.phone}</div>
          </div>
        )
      },
      {
        accessorKey: 'stream',
        header: ({ column }) => <SortableHeader column={column} title="STREAM" />,
        cell: ({ row }) => <div className="text-xs font-normal text-[#222222] md:text-sm">{row.getValue('stream')}</div>
      },
      {
        accessorKey: 'standard',
        header: () => <div className="text-center text-xs font-medium text-[#222222] md:text-sm">STANDARD</div>,
        cell: ({ row }) => (
          <div className="text-xs font-normal text-[#222222] md:text-center md:text-sm">{row.getValue('standard')}</div>
        )
      },
      {
        accessorKey: 'state',
        header: () => <div className="text-xs font-medium text-[#222222] md:text-sm">STATE</div>,
        cell: ({ row }) => <div className="text-xs font-normal text-[#222222] md:text-sm">{row.getValue('state')}</div>
      },
      {
        accessorKey: 'template',
        header: () => <div className="text-xs font-medium text-[#222222] md:text-sm">TEMPLATE</div>,
        cell: ({ row }) => <div className="text-xs font-normal text-[#222222] md:text-sm">{row.getValue('template')}</div>
      },
      {
        accessorKey: 'coupon',
        header: () => <div className="text-xs font-medium text-[#222222] md:text-sm">COUPON</div>,
        cell: ({ row }) => <div className="text-xs font-normal text-[#222222] md:text-sm">{row.original.coupon || '-'}</div>
      },
      {
        accessorKey: 'date',
        header: ({ column }) => <SortableHeader column={column} title="DATE" center={true} />,
        cell: ({ row }) => <div className="text-xs font-normal text-[#222222] md:text-sm">{formatDate(row.getValue('date'))}</div>
      },
      {
        accessorKey: 'status',
        header: () => <div className="text-center text-xs font-medium text-[#222222] md:text-sm">STATUS</div>,
        cell: ({ row }) => {
          // Get the actual status object from row data
          const statusCounts = row.original.status;

          return (
            <div className="flex items-center justify-center space-x-2">
              {/* Success */}
              <div className="flex items-center space-x-1 rounded-lg bg-[#0F9D5833] px-1.5">
                <span className="size-1 rounded-full bg-[#0F9D58] md:size-1.5"></span>
                <span className="text-xs font-medium text-[#0F9D58] md:text-sm">{statusCounts.success || 0}</span>
              </div>

              {/* Initiated */}
              <div className="flex items-center space-x-1 rounded-lg bg-[#FFAD431A] px-1.5">
                <span className="size-1 rounded-full bg-[#FFAD43] md:size-1.5"></span>
                <span className="text-xs font-medium text-[#FFAD43] md:text-sm">{statusCounts.initiated || 0}</span>
              </div>

              {/* Aborted */}
              <div className="flex items-center space-x-1 rounded-lg bg-[#FF474733] px-1.5">
                <span className="size-1 rounded-full bg-[#FF4747] md:size-1.5"></span>
                <span className="text-xs font-medium text-[#FF4747] md:text-sm">{statusCounts.aborted || 0}</span>
              </div>
            </div>
          );
        }
      },
      {
        id: 'actions',
        header: () => <div className="text-center text-xs font-medium text-[#222222] md:text-sm">INVOICE</div>,
        cell: ({ row }) => {
          const status = row.original.status; // Access status object

          return (
            <div className="flex justify-center">
              {status.success > 0 && ( // Show eye icon only if success > 0
                <Button variant="default" size="icon" className="bg-transparent text-[#222222] hover:bg-transparent">
                  <Icon icon="solar:eye-bold" className="size-4 md:size-5" />
                </Button>
              )}
            </div>
          );
        }
      }
    ],
    []
  );
};

// Reusable sortable column header
const SortableHeader = ({ column, title, center = false }: { column: any; title: string; center?: boolean }) => (
  <div className={`flex items-center whitespace-nowrap ${center ? 'justify-center' : 'justify-start'}`}>
    <span className="text-xs text-[#222222] md:text-sm">{title}</span>
    <button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="h-6 !p-0">
      <Icon
        icon="ic:round-arrow-drop-down"
        fontSize={24}
        className={`text-[#222222] transition-transform ${column.getIsSorted() === 'asc' ? 'rotate-180' : ''}`}
      />
    </button>
  </div>
);
