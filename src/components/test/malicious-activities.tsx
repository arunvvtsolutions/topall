'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MODELMessage } from '@/types/enum';

interface MaliciousModalProps {
  isOpen: boolean;
  onClose: () => void;
  showCloseIcon?: boolean;
}

export default function MaliciousModal({ isOpen, onClose, showCloseIcon = false }: MaliciousModalProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        showCloseIcon={showCloseIcon}
        className="max-w-sm rounded-[8px] border-2 border-[#FF4747] p-6 sm:max-w-md md:max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-normal text-[#FF4747] sm:text-xl">{MODELMessage.TITLE}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 text-center text-xs sm:text-base md:text-base">
          <p className="text-[#6F6F6F]">{MODELMessage.TAB_CHNAGED}</p>

          <Button size="sm" onClick={onClose} className="bg-[#FF4747] text-sm !px-5 !py-5 text-[#FFFFFF] hover:bg-[#FF4747]">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
