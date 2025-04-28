'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MODELMessage } from '@/types/enum';

interface AttentionModalProps {
  isOpen: boolean;
  onClose: () => void;
  showCloseIcon?: boolean;
}

export default function AttentionModal({ isOpen, onClose, showCloseIcon = false }: AttentionModalProps) {
  return (
    <Dialog open={isOpen} >
      <DialogContent className="max-w-sm border-2 border-[#FF4747] p-5  sm:max-w-lg md:max-w-lg" showCloseIcon={showCloseIcon}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-normal text-[#FF4747] sm:text-xl">{MODELMessage.TITLE_ATTENTION}</DialogTitle>
        </DialogHeader>
        <div className="space-y-8  text-center text-[12px] sm:text-base md:text-base">
          <div className='space-y-7 px-1'>
          <p className="text-[#6F6F6F] ">
          {MODELMessage.ANOTHERMES_ATTENTION}
          </p>
          <p className="text-[#6F6F6F]">
          {MODELMessage.ANOTHERMES_ATTENTION2}
          </p>
          </div>
          <Button onClick={onClose} size="sm" className="bg-[#FF4747] font-medium text-sm !px-5 !py-5 text-white hover:bg-[#FF4747]">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
