import React from 'react';
import { MainDialog } from '@/components/common/MainDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Icon } from '@/components/ui/icon';
import { FormFields } from '@/types/enum';

const PriceHistory = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const handleModalClose = () => {};

  const tableData = [
    { id: 1, actualPrice: 1000, discountedPrice: 800, date: '25-02-2025' },
    { id: 2, actualPrice: 1200, discountedPrice: 900, date: '26-02-2025' }
  ];

  return (
    <MainDialog title="Price History" isOpen={isOpen} onOpenChange={onClose} size="md">
      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[600px] border-collapse">
            {/* Table Header */}
            <TableHeader className="bg-[#FBFBFD]">
              <TableRow>
                <TableHead className="px-4 py-2 text-sm text-center font-medium text-primary !normal-case">S.No</TableHead>
                <TableHead className="px-4 py-2 text-sm text-center font-medium text-primary !normal-case">Actual Price</TableHead>
                <TableHead className="px-4 py-2 text-sm text-center font-medium text-primary !normal-case">Discounted Price</TableHead>
                <TableHead className="px-4 py-2 text-sm text-center font-medium text-primary !normal-case">Date</TableHead>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {tableData.length > 0 ? (
                tableData.map((row, index) => (
                  <TableRow key={row.id} className="border-t">
                    <TableCell className="px-4 py-2 text-center font-medium text-[#4B4B4B]">{index + 1}</TableCell>
                    <TableCell className="flex items-center justify-center gap-1 px-4 py-2 text-center font-semibold text-[#4B4B4B]">
                      <Icon icon="bx:rupee" />
                      {row.actualPrice}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-center font-semibold text-[#4B4B4B]">
                      <div className="flex items-center justify-center gap-1">
                        <Icon icon="bx:rupee" />
                        {row.discountedPrice}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-2 text-center font-semibold text-[#4B4B4B]">{row.date}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="px-4 py-2 text-center text-gray-500">
                    {FormFields.NO_DATA_MSG}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainDialog>
  );
};

export default PriceHistory;
