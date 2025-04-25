'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MainDialog } from '@/components/common/MainDialog';

import { Button } from '@/components/ui/button';
import { dispatch, useSelector } from '@/store';
import { GenericType, Standard, Testtype } from '@/types';
import { getStandards, getStreams, getTesttype } from '@/store/slice/admin/academic';
import { MultiSelect } from '@/components/common/MultiSelect';
import { FilterExamPayload } from '@/types/exams';
import { initialFilters, setExamFiltersSuccess } from '@/store/slice/admin/exams';
import { ButtonNames, FormFields } from '@/types/enum';

const statusOptions = [
  { id: 0, name: 'Not Published', value: 'Not Published' },
  { id: 1, name: 'Published', value: 'Published' }
];

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  updateQueryParams: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, updateQueryParams }) => {
  const { streams } = useSelector((state) => state.selectors);
  const { standards, testtype } = useSelector((state) => state.academic);
  const { examFilters } = useSelector((state) => state.adminExams);

  const [filterData, setFilterData] = useState<FilterExamPayload>(examFilters);

  //filtered standards
  const filteredStandards = useMemo(() => {
    if (!filterData.streamIds.length) return [];
    const filteredStds = standards.filter((std: Standard) => filterData.streamIds.includes(std.streams.id));
    return filteredStds.map((std: Standard) => ({ id: std.id, name: std.name }));
  }, [standards, filterData.streamIds]);

  //filtered testtype
  const filteredTestTypes = useMemo(() => {
    if (!filterData.streamIds.length) return [];
    return testtype
      .filter((ttype: Testtype) => ttype.stream_id !== null && filterData.streamIds.includes(ttype.streams.id))
      .map((ttype: Testtype) => ({ id: ttype.id, name: ttype.test_type_list.name }));
  }, [testtype, filterData.streamIds]);

  useEffect(() => {
    setFilterData(examFilters);
  }, [examFilters]);

  useEffect(() => {
    const initialCall = async () => {
      await Promise.allSettled([dispatch(getStreams()), dispatch(getStandards()), dispatch(getTesttype())]);
    };
    initialCall();
  }, []);

  //handle change filter data
  const handleFilterChange = useCallback(
    (key: keyof FilterExamPayload, value: number[]) => {
      setFilterData((prev) => {
        const newData = { ...prev, [key]: value };

        // When stream selection changes
        if (key === 'streamIds') {
          // Filter out standards that don't belong to the selected streams
          const validStandardIds = prev.standardIds.filter((standardId) => {
            const standard = standards.find((s) => s.id === standardId);
            return standard && value.includes(standard.streams.id);
          });

          // Filter out test types that don't belong to the selected streams
          const validTestTypeIds = prev.testTypeIds.filter((typeId) => {
            const testType = testtype.find((t) => t.id === typeId);
            return testType && value.includes(testType.streams.id);
          });

          newData.standardIds = validStandardIds;
          newData.testTypeIds = validTestTypeIds;
        }

        return newData;
      });
    },
    [standards, testtype]
  );

  // Function to apply filters and fetch the filtered data
  const applyFilters = async () => {
    dispatch(setExamFiltersSuccess(filterData));
    updateQueryParams();
    onClose();
  };

  // Function to clear all selected filters
  const clearFilters = useCallback(() => {
    dispatch(setExamFiltersSuccess(initialFilters));
    setFilterData(initialFilters);
    updateQueryParams();
    onClose();
  }, [initialFilters]);

  return (
    <MainDialog isOpen={isOpen} onOpenChange={onClose} size="lg1" className="text-xl font-normal" title="Filter Tests">
      {/* Modal content */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-base font-normal text-B2CAgray">{FormFields.STATUS}</label>
          <MultiSelect
            options={statusOptions}
            onValueChange={(value) => handleFilterChange('publishType', value)}
            defaultValue={filterData.publishType}
            placeholder="Select Status"
            variant="default"
            color="secondary"
            dataTestId="multi-select-status"
            className="rounded-lg"
          />
        </div>

        <div>
          <label className="mb-1 block text-base font-normal text-B2CAgray">{FormFields.STREAM}</label>
          <MultiSelect
            options={streams}
            onValueChange={(value) => handleFilterChange('streamIds', value)}
            defaultValue={filterData.streamIds}
            placeholder="Select stream"
            variant="default"
            color="secondary"
            dataTestId="multi-select-streams"
            maxCount={1}
            className="rounded-lg"
          />
        </div>

        <div>
          <label className="mb-1 block text-base font-normal text-B2CAgray">{FormFields.STANDARD}</label>
          <MultiSelect
            options={filteredStandards}
            onValueChange={(value) => handleFilterChange('standardIds', value)}
            defaultValue={filterData.standardIds}
            placeholder={filteredStandards.length ? 'Select Standard' : 'Select Stream First'}
            variant="default"
            color="secondary"
            maxCount={1}
            dataTestId="multi-select-standards"
            className="rounded-lg"
          />
        </div>

        <div>
          <label className="mb-1 block text-base font-normal text-B2CAgray">{FormFields.TESTTYPE}</label>
          <MultiSelect
            options={filteredTestTypes}
            onValueChange={(value) => handleFilterChange('testTypeIds', value)}
            defaultValue={filterData.testTypeIds}
            placeholder={filteredTestTypes.length ? 'Select Test Type' : 'Select Stream First'}
            variant="default"
            color="secondary"
            maxCount={1}
            dataTestId="multi-select-testtype"
            className="rounded-lg"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col justify-end gap-4 sm:flex-row sm:gap-2">
        <Button
          size="md"
          variant="outline"
          color="primary"
          data-testid="cancel-filter-button"
          className="rounded-lg text-sm font-normal hover:bg-white hover:text-primary"
          onClick={clearFilters}
        >
          {ButtonNames.CLEAR}
        </Button>
        <Button
          size="md"
          variant="default"
          color="primary"
          data-testid="show-filter-button"
          className="rounded-lg text-sm font-normal"
          onClick={applyFilters}
        >
          {ButtonNames.SHOW_ALL}
        </Button>
      </div>
    </MainDialog>
  );
};

export default FilterModal;
