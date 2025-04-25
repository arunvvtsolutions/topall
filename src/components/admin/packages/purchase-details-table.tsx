import { Button } from '@/components/ui/button';
import { ChevronDown, Eye } from 'lucide-react';
import React, { useState } from 'react';
import {
  type ColumnDef,
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
import { useTableColumns } from './purchase-table-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SelectDropdown from '@/components/common/Select';
import { purchaseData, statesInIndia, statusList, streams } from './mock-data';
import SearchInput from '@/components/common/search-input';
import { GenericType, StudentPurchase } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { PaginationWithLinks } from '@/components/common/pagination-with-links';

const PurchaseDetailsTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [statusFilter, setStatusFilter] = useState<GenericType>();
  const [streamFilter, setStreamFilter] = useState<GenericType>();
  const [stateFillter, setStateFilter] = useState<GenericType>();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const [page, setPage] = useState(Number(searchParams.get('page') || '1'));
  const [search, setSearch] = useState(searchParams.get('search') || '');

  // Update Query Params
  const updateQueryParams = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });
    router.push(`?${newSearchParams.toString()}`);
  };

  // Search Change Handler
  const handleSearchChange = (value: string) => {
    const newValue = value.trimStart();
    setSearch(newValue);
    setPage(1);
    updateQueryParams({ search: newValue, page: '1' });
  };

  // Page Change Handler
  const handlePageChange = (newPage: number) => {
    if (newPage === page) return;
    setPage(newPage);
    updateQueryParams({ page: newPage.toString() });
  };

  // Status Filter Handler
  const statusFilterHandler = (status: GenericType) => {
    setStatusFilter(status);
  };

  // Stream Filter Handler
  const streamFilterHandler = (stream: GenericType) => {
    setStreamFilter(stream);
  };

  // State Filter Handler
  const stateFilterHandler = (state: GenericType) => {
    setStateFilter(state);
  };

  const tableColumns = useTableColumns();

  const table = useReactTable({
    data: purchaseData,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
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
      rowSelection,
      globalFilter
    }
  });

  return (
    <div className="overflow-x-auto">
      <Card className="flex min-h-[645px] w-full flex-col">
        <CardHeader className="p-4">
          <div className="flex flex-col items-start justify-between md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="mb-2 text-base font-medium text-[#222222] sm:mb-0 md:text-lg">Purchase Details</CardTitle>
            </div>
            <div className="mt-2 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:mt-0 md:flex md:w-auto">
              <SelectDropdown
                data={statusList || []}
                onChange={statusFilterHandler}
                name="all-status"
                value={statusFilter}
                placeholder="All Status"
                size="default"
                width="md:w-[130px] w-full"
                fontWeight="font-normal"
                fontsize="text-xs sm:text-sm"
                primaryIcon={false}
                placeholderColor="text-[#4B4B4B]"
              />
              <SelectDropdown
                data={streams}
                onChange={streamFilterHandler}
                name="stream"
                value={streamFilter}
                size="default"
                width="md:w-[130px] w-full"
                fontWeight="font-normal"
                fontsize="text-xs sm:text-sm"
                placeholder="All Stream"
                primaryIcon={false}
                placeholderColor="text-[#4B4B4B]"
              />
              <SelectDropdown
                data={statesInIndia}
                onChange={stateFilterHandler}
                name="state"
                value={stateFillter}
                size="default"
                width="md:w-[130px] w-full"
                fontWeight="font-normal"
                fontsize="text-xs sm:text-sm"
                placeholder="All State"
                primaryIcon={false}
                placeholderColor="text-[#4B4B4B]"
              />
              <div className="w-full sm:w-auto">
                <SearchInput
                  color="secondary"
                  placeholder="Search by ID or Name"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="rounded-md text-sm font-normal text-primary placeholder:text-sm placeholder:font-normal placeholder:text-[#4B4B4B]"
                  left={true}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-grow flex-col !px-0">
          <div className="mb-6 flex-grow overflow-hidden">
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="hover:bg-muted/50">
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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

          <div className="mt-auto">
            <PaginationWithLinks page={page} pageSize={10} totalCount={purchaseData.length} onPageChange={handlePageChange} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseDetailsTable;
