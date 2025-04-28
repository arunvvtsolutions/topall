'use client';

import { useEffect, useState } from 'react';
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaginationWithLinks } from '@/components/common/pagination-with-links';
import SelectDropdown from '@/components/common/Select';
import SearchInput from '@/components/common/search-input';
import { GenericType, Student } from '@/types';
import { plans, status, students } from './mock-data';
import { useRouter } from 'next/navigation';
import { useTableColumns } from './table-headers';

interface StudentTableProps {
  search: string;
  page: number;
  onSearch: (search: string) => void;
  onPageChange: (page: number) => void;
}

const StudentsTable: React.FC<StudentTableProps> = ({ search, page, onSearch, onPageChange }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [statusFilter, setStatusFilter] = useState<GenericType>({ name: 'All', id: 0 });
  const [planFilter, setPlanFilter] = useState<GenericType>({ name: 'All', id: 0 });

  const [studentsData, setStudentsData] = useState<Student[]>([]);

  const router = useRouter();
  const tableColumns = useTableColumns();
  // Set a minimum height for the table to prevent flickering
  const tableMinHeight = 400; // Adjust based on your needs

  const table = useReactTable({
    data: studentsData,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });

  // View Student Profile Handler
  const handleViewStudent = (studentId: number) => {
    router.push(`/admin/students/profile/${studentId}`);
  };

  // Status Change Handler
  const statusChangeHandler = (status: GenericType) => {
    setStatusFilter(status);
  };

  // Plan Change Handler
  const planChangeHandler = (plan: GenericType) => {
    setPlanFilter(plan);
  };

  useEffect(() => {
    setStudentsData(students);
  }, []);

  return (
    <Card className="flex min-h-[645px] w-full flex-col">
      <CardHeader className="p-3 sm:pb-4">
        <div className="flex flex-col items-start justify-between md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="mb-1 text-base font-medium text-[#222222] sm:mb-0 md:text-lg">Student Details</CardTitle>
          </div>
          <div className="flex w-full flex-wrap justify-between gap-2 sm:w-auto">
            <SelectDropdown
              data={plans || []}
              onChange={planChangeHandler}
              name="plans"
              value={planFilter}
              placeholder="All"
              size="default"
              width="w-[90px]"
              fontWeight="font-normal"
              fontsize="text-xs sm:text-sm"
            />
            <SelectDropdown
              data={status}
              onChange={statusChangeHandler}
              name="status"
              value={statusFilter}
              size="default"
              width="w-[110px]"
              fontWeight="font-normal"
              fontsize="text-xs sm:text-sm"
            />
            <div className="w-full sm:w-auto">
              <SearchInput
                color="secondary"
                placeholder="Search by ID or Name"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                className="rounded-md text-sm font-normal text-primary"
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-grow flex-col !px-0">
        <div className="mb-6 flex-grow overflow-hidden">
          <div className="w-full overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="sticky top-0 z-10 bg-background">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className={header.column.id === 'plan' ? '!m-0 !p-0' : 'px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm'}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody style={{ minHeight: `${tableMinHeight}px` }}>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="hover:bg-muted/50">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={
                            cell.column.id === 'plan'
                              ? '!m-0 !p-0' // No padding for 'plan'
                              : 'px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm'
                          }
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Always at the bottom */}
        <div className="mt-auto">
          <PaginationWithLinks page={page} pageSize={10} totalCount={studentsData.length} onPageChange={onPageChange} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentsTable;
