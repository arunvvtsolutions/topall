'use client';

import SectionHeader from '@/components/common/section-heading';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useState } from 'react';
import GenerateFormModal from './generate-form';

const GenerateHeader = ({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean; setIsModalOpen: (isOpen: boolean) => void }) => {
  const handleAddSection = (open: boolean) => {
    setIsModalOpen(open);
  };

  return (
    <div>
      {/* Title */}
      <SectionHeader
        className="!flex-row border-borderad border-0 lg:border-b"
        title="Generate Test"
        noBorder
        action={
          <div className="flex w-full justify-end sm:ml-auto sm:w-auto">
            <Button
              onClick={() => handleAddSection(true)}
              size="md"
              variant="default"
              data-testid="subject-btn"
              className="z-20 flex min-w-[130px] items-center justify-center gap-1 border border-primary bg-white text-[14px] uppercase text-primary"
            >
              <Icon icon="si:add-fill" className="text-lg text-primary" />
              Generate Test
            </Button>
          </div>
        }
      />

      {/* Modal */}
      {isModalOpen && <GenerateFormModal open={isModalOpen} title="Generate New Test" onClose={() => handleAddSection(false)} />}
    </div>
  );
};

export default GenerateHeader;
