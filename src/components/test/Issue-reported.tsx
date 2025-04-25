'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MODELMessage } from '@/types/enum';

interface ReportedModalProps {
  isOpen: boolean;
  onClose: () => void;
  showCloseIcon?: boolean;
}

export default function ReportSuccessModal({ isOpen, onClose, showCloseIcon = false }: ReportedModalProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent  showCloseIcon={showCloseIcon} className="max-w-sm rounded-[8px] border-2  p-4 sm:max-w-sm md:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-normal text-[#222222] sm:text-xl">
            {MODELMessage.TITLE_REPORT}
          </DialogTitle>
        </DialogHeader>
        <div className=" text-center text-[12px] sm:text-base md:text-base">
          <p className="text-[#6F6F6F] mb-6">Issue reported successfully</p>

          <Button size="sm" onClick={onClose} className="bg-[#000080] !px-5 !py-5 text-sm font-medium text-[#FFFFFF] hover:bg-[#000080]">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
