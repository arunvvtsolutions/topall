import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Student } from '@/types';
import { TableHeaders, Status } from '@/types/enum';

export const useTableColumns = () => {
  const router = useRouter();

  const handleViewStudent = (studentId: number) => {
    router.push(`/admin/students/profile/${studentId}`);
  };

  return useMemo<ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: 'plan',
        header: () => null,
        cell: ({ row }) => {
          const plan = row.original.plan;
          return (
            <div className="flex h-full flex-col items-center justify-center gap-0.5">
              <div
                className={`h-12 w-1 rounded-r rounded-br-full rounded-tr-full sm:h-14 ${
                  plan === 'paid' ? 'bg-[#FFA126]' : 'bg-[#0F9D58]'
                }`}
              />
            </div>
          );
        },
        size: 12
      },
      {
        accessorKey: 'id',
        header: () => <div className="text-center text-sm text-primary">{TableHeaders.ID}</div>,
        cell: ({ row }) => <div className="text-center text-sm font-medium text-[#222222]">{row.getValue('id')}</div>
      },
      {
        accessorKey: 'device',
        header: () => <div className="text-center text-sm text-primary">{TableHeaders.DEVICE}</div>,
        cell: ({ row }) => {
          const device = row.getValue('device') as string;
          return (
            <div className="flex justify-center text-[#222222]">
              {device === 'desktop' ? <Monitor className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
            </div>
          );
        }
      },
      {
        accessorKey: 'name',
        header: () => <div className="text-left text-sm text-primary">{TableHeaders.STUDENT_NAME}</div>,
        cell: ({ row }) => {
          const student = row.original;
          return (
            <div className="min-w-48">
              <div
                onClick={() => handleViewStudent(student.id)}
                className="text-sm font-normal text-[#222222] hover:cursor-pointer hover:text-primary"
              >
                {student.name}
              </div>
              <div className="text-[13px] text-[#4B4B4B]">{student.phone}</div>
            </div>
          );
        }
      },
      {
        accessorKey: 'screenTime',
        header: ({ column }) => <SortableHeader column={column} title={TableHeaders.SCREEN_TIME} />,
        cell: ({ row }) => <CenteredText value={row.getValue('screenTime')} />
      },
      {
        accessorKey: 'testsTaken',
        header: ({ column }) => <SortableHeader column={column} title={TableHeaders.TESTS_TAKEN} />,
        cell: ({ row }) => <CenteredText value={row.getValue('testsTaken')} />
      },
      {
        accessorKey: 'questions',
        header: ({ column }) => <SortableHeader column={column} title={TableHeaders.QUESTIONS} />,
        cell: ({ row }) => <CenteredText value={row.getValue('questions')} />
      },
      {
        accessorKey: 'since',
        header: ({ column }) => <SortableHeader column={column} title={TableHeaders.SINCE} />,
        cell: ({ row }) => <CenteredText value={row.getValue('since')} />
      },
      {
        accessorKey: 'lastSeen',
        header: ({ column }) => <SortableHeader column={column} title={TableHeaders.LAST_SEEN} />,
        cell: ({ row }) => <CenteredText value={row.getValue('lastSeen')} />
      },
      {
        accessorKey: 'status',
        header: () => <div className="text-center text-sm text-primary">STATUS</div>,
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          return (
            <div className="flex min-w-24 justify-center">
              <Badge
                className={`rounded-full text-sm ${status === 'active' ? 'bg-[#ECFDF3] text-Active' : 'bg-[#F2F4F7] text-gray-600'}`}
              >
                <Icon icon={'stash:circle-duotone'} fontSize={'8PX'} className="mr-1" />
                {status}
              </Badge>
            </div>
          );
        }
      }
    ],
    []
  );
};

// Reusable sortable column header
const SortableHeader = ({ column, title }: { column: any; title: string }) => (
  <div className="flex items-center justify-center whitespace-nowrap">
    <span className="text-sm text-primary">{title}</span>
    <button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="h-6 !p-0">
      <Icon
        icon="ic:round-arrow-drop-down"
        fontSize={24}
        className={`text-primary transition-transform ${column.getIsSorted() === 'asc' ? 'rotate-180' : ''}`}
      />
    </button>
  </div>
);

// Reusable centered cell text
const CenteredText = ({ value }: { value: any }) => <div className="text-center text-sm font-normal text-[#222222]">{value}</div>;
