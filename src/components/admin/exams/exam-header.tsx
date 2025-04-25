import React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import SearchInput from '@/components/common/search-input';
import { AdminOnlyGroups, ButtonNames, HeadersTitle, Roles } from '@/types/enum';
import { useSession } from 'next-auth/react';

interface IExamHeader {
  onShowFilter: () => void;
  onShowCreate: () => void;
  totalExamCount?: number;
  onSearchChange: (value: string) => void;
  searchValue: string;
}

const ExamHeader = ({ onShowFilter, onShowCreate, totalExamCount, searchValue, onSearchChange }: IExamHeader) => {
  const { data } = useSession();
  return (
    <div className="flex flex-col justify-between gap-y-2 md:flex-row md:gap-y-0">
      <div className="flex flex-1 items-center justify-between md:flex-none">
        <h1 className="text-[20px] font-semibold text-B2CAgrayn sm:text-xl md:text-xl">
          {HeadersTitle.EXAMS_LIST} {totalExamCount !== undefined ? `(${totalExamCount})` : ''}
        </h1>
        <div className="md:item-center flex gap-x-2 md:hidden">
          <Button
            size="icon"
            variant="outline"
            color="primary"
            onClick={onShowFilter}
            className="h-9 w-9 rounded-sm"
            data-testid="filter-btn "
          >
            <Icon icon="fluent:filter-32-filled" className="mr-1" />
          </Button>
          {AdminOnlyGroups.includes(data?.user.role as Roles) && (
            <div className="rounded-lg text-primary hover:border-primary hover:bg-primary hover:text-white">
              <Button
                onClick={onShowCreate}
                size="sm"
                variant="outline"
                color="primary"
                className="h-9 rounded-sm"
                data-testid="create-test-btn"
              >
                <Icon icon="si:add-fill" className="mr-1" />
                {ButtonNames.CREATE_TEST}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 space-y-4 sm:flex sm:items-center sm:gap-4 sm:space-y-0 md:justify-end">
        <div className="w-full md:w-[300px]">
          <SearchInput
            placeholder="Search by ID or Name"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="text-xs text-[#4B4B4B]"
          />
        </div>
        <div className="md:item-center hidden md:flex md:gap-x-2">
          <Button
            size="md"
            variant="outline"
            color="primary"
            className="h-9 w-full rounded-sm sm:w-auto"
            onClick={onShowFilter}
            data-testid="filter-btn"
          >
            <Icon icon="fluent:filter-32-filled" className="mr-1 text-base lg:text-xl" />
            {ButtonNames.FILTER_TEST}
          </Button>
          {AdminOnlyGroups.includes(data?.user.role as Roles) && (
            <Button
              size="sm"
              variant="outline"
              color="primary"
              className="h-9 w-full rounded-sm !px-6 font-medium sm:w-auto"
              data-testid="create-test-btn"
              onClick={onShowCreate}
            >
              <Icon icon="si:add-fill" className="mr-1 text-base lg:text-xl" />
              {ButtonNames.CREATE_TEST}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamHeader;
