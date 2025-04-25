'use client';

import type React from 'react';
import { useEffect } from 'react';
import FilterButton from './FilterButtons';

interface RegionalFiltersProps {
  regional: boolean;
  selectedFilter: number;
  handleFilterChange: (filterId: number, regionalTypeIndex?: number) => void;
}

const filterButtons = [
  {
    id: 1,
    name: 'Question Used',
    icon: '/images/icon/note-2.svg',
    filledIcon: '/images/icon/note-2-1.svg',
    regionalTypeIndex: 0 // corresponds to 'questionwise'
  },
  {
    id: 2,
    name: 'Time Spent',
    icon: '/images/icon/timer.svg',
    filledIcon: '/images/icon/timer-1.svg',
    regionalTypeIndex: 1 // corresponds to 'timewise'
  },
  {
    id: 3,
    name: 'Referrals',
    icon: '/images/icon/ticket-discount.svg',
    filledIcon: '/images/icon/ticket-discount-1.svg',
    regionalTypeIndex: 2 // corresponds to 'referralwise'
  }
];

const RegionalFilters: React.FC<RegionalFiltersProps> = ({ regional, selectedFilter, handleFilterChange }) => {
  useEffect(() => {
    if (regional && selectedFilter === 0) {
      // Only set default if no filter is selected yet
      handleFilterChange(1, 0);
    }
  }, [regional, selectedFilter, handleFilterChange]);

  if (!regional) return null;

  return (
    <div className="flex w-full justify-center sm:justify-end">
      {filterButtons.map((button) => (
        <FilterButton
          key={button.id}
          label={button.name}
          icon={button.icon}
          filledIcon={button.filledIcon}
          selected={selectedFilter === button.id}
          className={`text-xs font-normal md:text-sm ${selectedFilter === button.id ? '' : 'bg-[#2222220A] text-[#6F6F6F]'}`}
          color={selectedFilter === button.id ? 'primary' : 'secondary'}
          onClick={() => handleFilterChange(button.id, button.regionalTypeIndex)}
        />
      ))}
    </div>
  );
};

export default RegionalFilters;
