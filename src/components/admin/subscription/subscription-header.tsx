'use client';
import React, { useState } from 'react';
import SelectDropdown from '@/components/common/Select';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { SubscriptionTitles } from '@/types/enum';
import AddSubscription from './add-subscription';

const SubscriptionHeader = ({
  activeTab,
  setActiveTab
}: {
  activeTab: 'active' | 'inactive';
  setActiveTab: (tab: 'active' | 'inactive') => void;
}) => {
  const [selectExam, setSelectExam] = useState<any[]>([]);
  const handleSelectHandler = (data: any) => {
    console.log(data, 'setSelectExam');
  };
  const [isOpen, setIsOpen] = useState(false);

  const handleModalOpen = () => {
    setIsOpen(true);
  };

  const handleModalClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="mb-6 flex flex-col items-start md:items-center justify-between gap-4 md:flex-row md:border-b md:border-borderad">
        {/* Tabs for Active / Inactive */}
        <div className="flex gap-6">
          <button
            className={`mt-3 pb-3 text-xl font-semibold ${
              activeTab === 'active' ? 'border-b-2 border-primary text-primary' : 'text-[#222222]'
            }`}
            onClick={() => setActiveTab('active')}
          >
            ACTIVE
          </button>

          <button
            className={`mt-3 pb-3 text-xl font-semibold ${
              activeTab === 'inactive' ? 'border-b-2 border-primary text-primary' : 'text-[#222222]'
            }`}
            onClick={() => setActiveTab('inactive')}
          >
            INACTIVE
          </button>
        </div>

        {/* Filter & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Exam Selection */}
          <SelectDropdown
            data={[
              { id: 0, name: 'JEE Main' },
              { id: 1, name: 'Neet' }
            ]}
            value={selectExam}
            onChange={handleSelectHandler}
            placeholder="Select Exam"
            name="exam"
            size="default"
            color="text-[#6F6F6F]"
            placeholderColor="text-[#6F6F6F]"
            text="text-[#4B4B4B]"
            aria-label="Select Exam Type"
          />

          {/* Academic Year Selection */}
          <SelectDropdown
            data={[
              { id: 0, name: '2024' },
              { id: 1, name: '2025' }
            ]}
            value={selectExam}
            onChange={handleSelectHandler}
            placeholder="Select Academic Year"
            name="academicYear"
            size="default"
            color="text-[#6F6F6F]"
            placeholderColor="text-[#6F6F6F]"
            aria-label="Select Academic Year"
            text="text-[#4B4B4B]"
          />

          {/* Add Subscription Button */}
          <Button
            size="default"
            variant="default"
            color="primary"
            className="flex h-8 gap-2 py-2"
            aria-label="Add Subscription"
            onClick={handleModalOpen}
          >
            <Icon icon="mingcute:add-fill" />
            {SubscriptionTitles.ADD_SUBSCRIPTION}
          </Button>
        </div>
      </div>

      {/* Pass Modal Props to AddSubscription */}
      <AddSubscription isOpen={isOpen} onClose={handleModalClose} />
    </>
  );
};

export default SubscriptionHeader;
