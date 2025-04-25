'use client';
import { LucideLoader } from '@/components/common/LucideLoader';
import { MainDialog } from '@/components/common/MainDialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UsageHistoryProps } from '@/types/exams';
import { getUsageHistory } from '@/utils/api/exams';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
  questionId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const UsageHistoryModal = ({ questionId, isOpen, onClose }: Props) => {
  const [qHistory, setQHistory] = useState<UsageHistoryProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  //columns
  const columns = [
    { header: 'S.No', accessor: 'sno' },
    { header: 'Test Name', accessor: 'test-name' },
    { header: 'Date', accessor: 'date' }
  ];

  //get data
  useEffect(() => {
    async function fetchData() {
      if (!isOpen || !questionId) return;

      setLoading(true);
      try {
        const response = await getUsageHistory(questionId);
        setQHistory(response?.tests || []);
      } catch (err) {
        toast.error('Error fetching usage history');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isOpen, questionId]);

  return (
    <MainDialog isOpen={isOpen} onOpenChange={onClose} size="lg1" title="Question Usage history">
      {loading ? (
        <div className="flex h-[395px] items-center justify-center">
          <LucideLoader />
        </div>
      ) : (
        <ScrollArea className="h-[395px] border-[0.5px]" type="scroll">
          <Table className="h-[200px] border-collapse rounded-[8px] rounded-b-sm">
            <TableHeader className="text-B2Cblue sticky top-[-1px] z-10 rounded-t-xl bg-headingclor">
              <TableRow className="sticky top-0 z-10">
                {columns.map((column, idx) => (
                  <TableHead
                    key={idx}
                    className={`font-inter !h-10 border-y-[0.2px] border-borderad pr-1 text-left text-sm font-medium normal-case text-primary`}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {qHistory?.length > 0 ? (
                qHistory.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-test-id={row?.id}
                    className="font-inter !h-0 border-y-[0.5px] border-borderad text-center text-sm font-medium"
                  >
                    <TableCell className="!h-11 whitespace-nowrap pl-8 text-left text-sm font-medium text-B2CAgrayn">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-inter !h-11 whitespace-nowrap text-left text-sm font-semibold text-B2CAgray">
                      {row.name}
                    </TableCell>
                    <TableCell className="font-inter !h-11 whitespace-nowrap text-left text-sm font-normal text-B2CAgray">
                      {row.scheduledAt ? moment(row.scheduledAt).format('MM/DD/YYYY') : '-'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="text-center">
                    No Data Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </MainDialog>
  );
};

export default UsageHistoryModal;
