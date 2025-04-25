'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type React from 'react';
import { useEffect, useState, useRef } from 'react';
import RegionalFilters from './regional-filters';
import './leaderboard.css';
import { useSearchParams } from 'next/navigation';
import { formatTime } from '../utils';

interface LeaderboardTableProps {
  regional: boolean;
  data: any;
  onRegionalFilterChange?: (filterId: number, regionalTypeIndex: number) => void;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ regional, data, onRegionalFilterChange }) => {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter');
  const [selectedFilter, setSelectedFilter] = useState<number>(1);
  const [sortedData, setSortedData] = useState(data);
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const handleFilterChange = (filterId: number, regionalTypeIndex?: number) => {
    setSelectedFilter(filterId);

    if (regional && onRegionalFilterChange && regionalTypeIndex !== undefined) {
      onRegionalFilterChange(filterId, regionalTypeIndex);
    }
  };

  useEffect(() => {
    const header = headerRef.current;
    const body = bodyRef.current;

    if (header && body) {
      const handleScroll = () => {
        header.scrollLeft = body.scrollLeft;
      };

      body.addEventListener('scroll', handleScroll);
      return () => {
        body.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <Card className="w-full overflow-hidden">
      <div className="block items-center justify-between border-b px-5 py-4 sm:flex">
        <h2 className="mb-2 text-lg font-semibold md:mb-0">Global Ranking</h2>
        <div>
          <ScrollArea>
            <RegionalFilters regional={regional} selectedFilter={selectedFilter} handleFilterChange={handleFilterChange} />
            <ScrollBar orientation="horizontal" className="h-1" />
          </ScrollArea>
        </div>
      </div>

      <div className="relative" ref={tableContainerRef}>
        {/* Set a fixed height on the ScrollArea */}
        <ScrollArea className="h-[665px] w-full" ref={bodyRef}>
          <div className="min-w-[665px]">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-white">
                <TableRow>
                  <TableHead className="w-[100px] text-start text-sm font-medium normal-case text-[#222222] sm:text-center md:text-base">
                    Rank
                  </TableHead>
                  <TableHead className="w-[300px] text-left text-sm font-medium normal-case text-[#222222] md:text-base">
                    Name
                  </TableHead>
                  <TableHead className="w-[150px] text-center text-sm font-medium normal-case text-[#222222] md:text-base 2xl:pr-0">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sortedData && sortedData.length > 0 ? (
                  sortedData.map((item: any, index: number) => (
                    <TableRow key={item.id || index} className="hover:bg-muted/50">
                      <TableCell className="pl-0 text-center text-xs font-medium md:pl-5 md:text-sm lg:pl-5 xl:pl-6 xl:text-center 2xl:pl-6">
                        <span
                          className={`${
                            index < 3
                              ? 'inline-flex size-5 items-center justify-center rounded-full bg-[#ECEFFB] text-primary xl:size-6'
                              : ''
                          }`}
                        >
                          {index + 1}
                        </span>
                      </TableCell>
                      <TableCell className="pl-6 sm:pl-7 md:pl-6 lg:pl-6 xl:pl-6 2xl:pl-6">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={item.image_url || '/images/avatar/avatar-1.png'} alt={item.name} />
                            <AvatarFallback>{item.name?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-[#4B4B4B] md:text-sm">{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="pr-6 text-center text-xs font-normal text-[#4B4B4B] md:pr-6 md:text-sm lg:pr-6 xl:pr-6 xl:text-center 2xl:pr-0 2xl:text-center">
                        {filterParam === 'time-spent' ? formatTime(item.total) : item.total}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-[400px] text-center text-sm text-muted-foreground">
                      <div className="flex h-full w-full items-center justify-center">No data found.</div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </Card>
  );
};

export default LeaderboardTable;
