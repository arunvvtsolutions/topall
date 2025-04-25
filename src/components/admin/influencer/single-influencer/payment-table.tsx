'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import { Badge } from '@/components/ui/badge';
import { FormFields } from '@/types/enum';

interface TableProps {
  data: any[];
  columns: Array<{ header: string; accessor: keyof any }>;
}

const PaymentTable = ({ data, columns }: TableProps) => {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    setRows(data);
  }, [data]);

  //table header
  const renderTableHead = () => {
    return (
      <TableHeader className="text-B2Cblue sticky top-[-1px] z-10 rounded-t-xl !border-b !border-t bg-[#FBFBFD]">
      <TableRow>
        {columns.map((column, idx) => (
          <TableHead
            key={idx}
            className={`font-inter border-y border-border text-sm font-medium text-[#0D068E] !capitalize 
              ${column.header === 'Time Frame' ? 'text-start' : 'text-center'}`}
          >
            {column.header}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
    );
  };

  //table body
  const renderTableBody = () => {
    return (
        <TableBody className='bg-white'>
        {rows.length > 0 ? (
          rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="text-center font-medium text-B2CAgrayn">{row.sNo}</TableCell>
              <TableCell className="text-center font-normal text-B2CAgrayn">{row.invoiceId}</TableCell>
              <TableCell className="text-start font-normal text-B2CAgrayn">{row.timeFrame}</TableCell>
              <TableCell className="text-center font-normal text-B2CAgrayn">{row.totalAmount}</TableCell>
              <TableCell className="text-center font-normal text-B2CAgrayn">{row.invoiceRaisedDate}</TableCell>
              <TableCell className="text-center font-normal text-B2CAgrayn">{row.amountTransferredDate}</TableCell>
              <TableCell className="text-center  font-normal text-B2CAgrayn">
                <Badge className={`text-center  rounded-full text-right  text-sm ${row.status === 'Completed' ? 'bg-[#ECFDF3] text-[#0F9D58]' : 'bg-[#6F6F6F33] text-gray-600'}`}>
                  {row.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              {FormFields.NO_DATA_MSG}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    );
  };

  return (
    <>
      <ScrollArea className="h-[395px] border" type="scroll">
        <Table className=" border-collapse overflow-y-auto rounded-[8px] rounded-b-sm border-borderad">
          {renderTableHead()}
          {renderTableBody()}
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
};

export default PaymentTable;
