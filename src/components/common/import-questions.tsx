import React from 'react';
import { Button } from '@/components/ui/button';

interface QuestionHeaderProps {
  selectedCount: number;
  totalCount: number;
  onImport: () => void;
  className?: string;
}

export default function QuestionHeader({ selectedCount, totalCount, onImport, className = '' }: QuestionHeaderProps) {
  return (
    <div
      className={`ml-0 w-auto justify-center text-center  flex flex-col rounded-[8px] border-2 border-primary sm:w-[350px] md:w-[700px] lg:w-[1400px]  ${className} sticky top-0 z-50`}
    >
      <div className="flex flex-col items-center justify-between p-2 sm:flex-row sm:p-2 md:p-2">
        <div className="mb-2 text-xs font-semibold text-foreground sm:mb-0 sm:text-sm md:text-base">
          
          {selectedCount}/{totalCount} Question{selectedCount !== 1 ? 's' : ''} Selected
        </div>
        <Button
          variant="default"
          size="sm"
          className="w-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 sm:w-auto sm:px-4 sm:py-2 sm:text-sm md:px-5 md:py-3 md:text-base"
          onClick={onImport}
        >
          Import Questions
        </Button>
      </div>
    </div>
  );
}
