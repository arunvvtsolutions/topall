import React from 'react';
import { MainDialog } from '@/components/common/MainDialog';
import { Button } from '@/components/ui/button';

interface ReportProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock report data
const reportData = [
  {
    title: 'Physics Test',
    date: '2025-01-10',
    time: '10:30 AM',
    totalMark: 100,
    accuracy: '85',
    resultMark: 85
  },
  {
    title: 'Chemistry Test',
    date: '2025-01-12',
    time: '12:00 PM',
    totalMark: 100,
    accuracy: '90',
    resultMark: 90
  },
  {
    title: 'Mathematics Test',
    date: '2025-01-15',
    time: '02:00 PM',
    totalMark: 100,
    accuracy: '80',
    resultMark: 80
  },
  {
    title: 'Physics Test',
    date: '2025-01-10',
    time: '10:30 AM',
    totalMark: 100,
    accuracy: '85',
    resultMark: 85
  }
];

const Report: React.FC<ReportProps> = ({ isOpen, onClose }) => {
  return (
    <div>
      <MainDialog className="!text-[18px]" title="TEST 01 [4 Attempts]" isOpen={isOpen} onOpenChange={onClose} size="md">
        <div className="border-t border-[rgba(16,16,16,0.15)] !pt-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reportData.map((item, index) => (
              <div
                key={index}
                className="border-[rgba(16, 16, 16, 0.15)] flex w-full flex-col items-end justify-between rounded-lg !border-[0.5px] bg-white p-2 lg:flex-row"
              >
                {/* Left Side: Report Details */}
                <div className="self-start">
                  <div className="mb-1.5 flex gap-2">
                    <p className="text-xs font-semibold text-[#222222] lg:text-sm">{item.date}</p>
                    <p className="text-xs font-semibold text-[#222222] lg:text-sm">{item.time}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 text-xs font-normal text-[#6F6F6F]">
                    <div className="flex gap-1">
                      <p>
                        {item.resultMark}/{item.totalMark}
                      </p>
                      <p> MARKS</p>
                    </div>
                    <p>| {item.accuracy}% Accuracy</p>
                  </div>
                </div>
                {/* Right Side: View Report Button */}
                <div className="flex flex-shrink-0 justify-end">
                  <Button className="max-h-[32px] max-w-[96px] rounded-[8px] border-[1px] border-primary px-2 py-2 text-[12px] text-primary transition duration-300 hover:bg-primary hover:text-white sm:text-[12px] md:px-4">
                    View Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainDialog>
    </div>
  );
};

export default Report;
