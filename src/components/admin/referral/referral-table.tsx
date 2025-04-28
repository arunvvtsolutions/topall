import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import { Button } from '@/components/ui/button';
import { FormFields, FormType, ReferralItems } from '@/types/enum';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface TableProps {
  data: any[];
  columns: Array<{ header: string; accessor: keyof any }>;
  onDelete: (id: number) => void;
  onEdit: (id: number, type: FormType) => void;
  referralHistory?: boolean;
}

const ReferralTable = ({ data, columns, onDelete, onEdit, referralHistory }: TableProps) => {
  const [rows, setRows] = useState<any[]>(data);
  
  useEffect(() => {
    setRows(data);
  }, [data]);
  // Filter columns if referralHistory is true
  const filteredColumns = referralHistory ? columns.filter((column) => column.accessor !== 'Action') : columns;

  //table header
  const renderTableHead = () => {
    return (
      <TableHeader className="text-B2Cblue sticky top-[-1px] z-10 rounded-t-xl border-b border-t bg-white">
        <TableRow>
          {filteredColumns.map((column, idx) => (
            <TableHead key={idx} className={`font-inter border-y border-border text-center text-sm font-medium text-[#222222]`}>
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
      <TableBody>
        {rows.length > 0 ? (
          rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="text-center font-medium text-[#4B4B4B]">{index + 1}</TableCell>
              <TableCell className="text-center font-normal text-[#4B4B4B]">{row.level}</TableCell>
              <TableCell className="text-center font-normal text-[#4B4B4B]">{row.referrer}</TableCell>
              <TableCell className="text-center font-normal text-[#4B4B4B]">{row.referee}</TableCell>
              <TableCell className="text-center font-normal text-[#4B4B4B]">{row.endDate}</TableCell>
              <TableCell className="text-center  font-normal text-[#4B4B4B]">
                <Badge
                  className={`rounded-full text-right ${ !referralHistory ? 'bg-[#ECFDF3] text-[#0F9D58]' : 'bg-[#6F6F6F33] text-gray-600'}`}
                >
                  <Icon icon={'stash:circle-duotone'} className="mr-1 text-xs" />
                  {referralHistory ? (
                    <span className="text-sm text-[#6F6F6F]">{ReferralItems.EXPIRED}</span>
                  ) : (
                    <span className={row.Status ==="Active" ? 'text-sm text-[#0F9D58]' : 'text-sm text-red-500'}>
                      {row.Status}
                    </span>
                  )}
                </Badge>
              </TableCell>
              {!referralHistory && (
                <TableCell className="text-center font-normal text-[#4B4B4B]">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      // disabled={published}
                      onClick={() => onEdit(row.id, FormType.EDIT)}
                      className={`group relative h-8 w-8 rounded-full bg-[rgba(255,161,38,1)] transition-all duration-200 ease-in-out hover:bg-white`}
                    >
                      <Icon
                        icon="cuida:edit-outline"
                        fontSize={15}
                        className={`text-white transition-colors duration-200 ease-in-out group-hover:text-[rgba(255,161,38,1)]`}
                      />
                    </Button>
                    <Button
                      size="icon"
                      onClick={() => onDelete(row.id)}
                      // disabled={published}
                      className={`group relative h-8 w-8 rounded-full bg-[rgba(255,71,71,1)] transition-all duration-200 ease-in-out`}
                    >
                      <Icon
                        icon="hugeicons:delete-03"
                        fontSize={15}
                        className={`text-white transition-colors duration-200 ease-in-out group-hover:text-[rgba(255,71,71,1)]`}
                      />
                    </Button>
                  </div>
                </TableCell>
              )}
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
        <Table className="h-[200px] border-collapse overflow-y-auto rounded-[8px] rounded-b-sm border-borderad">
          {renderTableHead()}
          {renderTableBody()}
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
};

export default ReferralTable;
