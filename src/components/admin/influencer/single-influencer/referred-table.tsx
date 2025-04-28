'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { FormFields } from '@/types/enum';

interface TableProps {
  data: any[];
  columns: Array<{ header: string; accessor: keyof any }>;
}

const ReferredTable = ({ data, columns }: TableProps) => {
  const [rows, setRows] = useState<any[]>(data);

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
              className={`font-inter border-y border-border text-sm font-medium !capitalize text-[#0D068E] ${column.header === 'Student Name' ? 'text-start' : 'text-center'}`}
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
      <TableBody className="bg-white">
        {rows.length > 0 ? (
          rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="text-center font-medium text-B2CAgrayn">{index + 1}</TableCell>
              <TableCell className="flex items-center justify-center text-center font-normal text-B2CAgrayn">
                {row.device === 'Computer' ? (
                  <Icon icon={'fa6-solid:computer'} />
                ) : row.device === 'Laptop' ? (
                  <Icon icon={'fluent-emoji-high-contrast:laptop'} />
                ) : (
                  <Icon icon={'icomoon-free:mobile'} />
                )}
              </TableCell>

              <TableCell className="text-center font-normal text-B2CAgrayn">
                <div className="text-start">{row.studentName}</div>
              </TableCell>
              <TableCell className="text-center font-normal text-B2CAgrayn">{row.testsTaken}</TableCell>
              <TableCell className="text-center font-normal text-B2CAgrayn">{row.questions}</TableCell>
              <TableCell className="text-center font-normal text-B2CAgrayn">{row.lastSeen}</TableCell>
              <TableCell className="text-center font-normal text-B2CAgrayn">
                <Badge
                  className={`rounded-full text-center text-right text-sm ${row.status === 'Active' ? 'bg-[#ECFDF3] text-[#0F9D58]' : 'bg-[#4B4B4B1A] text-[#4B4B4B]'}`}
                >
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
      <ScrollArea className="h-[395px] overflow-y-auto">
        <Table className="border-collapse rounded-[8px] rounded-b-sm border-borderad">
          {renderTableHead()}
          {renderTableBody()}
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
};

export default ReferredTable;
