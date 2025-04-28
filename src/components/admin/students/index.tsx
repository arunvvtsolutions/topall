'use client';

import React, { useEffect, useState } from 'react';
import AdminSectionHeader from './admin-section-header';
import { StudentStatusCard } from './students-status-card';
import DateRangePicker from './date-range-picker';
import SelectDropdown from '@/components/common/Select';
import StudentsTable from './students-table';
import { GenericType } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMediaQuery } from '@/hooks/use-media-query';
import { academicYears, studentsStatus } from './mock-data';

const Students = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isMd = useMediaQuery('(min-width: 489px)');

  const [page, setPage] = useState(Number(searchParams.get('page') || '1'));
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [academicYear, setAcademicYear] = useState<GenericType[]>([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<GenericType>(academicYears[0]);

  // Academic Year Change Handler
  const handleAcademicYearChange = (item: GenericType) => {
    const selectedYear = academicYear.find((year) => year.id === item.id) || academicYears[0];
    setSelectedAcademicYear(selectedYear);
  };

  // Date Range Change Handler
  const handleDateSelect = (date: any) => {
    console.log('date', date);
  };

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

  useEffect(() => {
    setAcademicYear(academicYears);
    setSelectedAcademicYear(academicYears[0]);
  }, []);

  return (
    <div className="mx-2 h-full min-h-[calc(100vh-5.97rem)] sm:mx-2 md:mx-2 lg:mx-2 xl:mx-6">
      <div>
        <AdminSectionHeader
          title="Students"
          action={
            <div className={`${isMd ? 'w-auto' : 'w-full'} flex flex-wrap gap-2`}>
              <DateRangePicker
                className={`${isMd ? 'w-auto' : 'w-full'} rounded-md border border-borderad bg-white`}
                onChange={handleDateSelect}
              />
              <SelectDropdown
                data={academicYear}
                name="academic-year"
                onChange={handleAcademicYearChange}
                size="md"
                value={selectedAcademicYear}
                placeholder="Select Academic Year"
                placeholderColor="text-[#4B4B4B]"
                fontWeight="font-normal"
                fontsize="text-xs sm:text-sm"
                width={!isMd ? 'w-full' : 'w-[160px]'}
              />
            </div>
          }
        />
      </div>
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {studentsStatus.map((item, index) => (
          <StudentStatusCard
            key={index}
            title={item.title}
            count={item.count}
            change={item.change}
            timeframe={item.timeframe}
            percentage={item.percentage}
            status={item.status}
          />
        ))}
      </div>
      <div>
        <StudentsTable search={search} page={Number(page)} onSearch={handleSearchChange} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default Students;
