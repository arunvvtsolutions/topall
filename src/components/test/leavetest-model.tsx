import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MODELMessage } from '@/types/enum';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from '@/store';
import {
  setAttemptedQuestions,
  setCurrentQuestion,
  setCurrentSection,
  setExamDetails,
  setSectionsList,
  setSelectedSubjects
} from '@/store/slice/onlineExamSlice';
import { clearDB } from '@/services/indexed-db';
import { ALL_INDIA_MOCK_TEST, GENERATE_TEST, PREVIOUS_YEAR_TEST } from '@/types/constants';
import { getRedirectPath } from '@/utils';

interface LeaveTestModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  showCloseIcon?: boolean;
  handleLeaveTest: () => void;
}

export default function LeaveTestModal({ isOpen, onClose, showCloseIcon = false, handleLeaveTest }: LeaveTestModalDialogProps) {
  const router = useRouter();
  const params = useSearchParams();
  const testTypeParams = params.get('testTypeId');
  const testTypeId = Number(testTypeParams);

  const leaveTestHandler = () => {
    handleLeaveTest();
    onClose();
    const redirectPath = getRedirectPath(testTypeId);
    router.push(redirectPath);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => console.error('Error exiting full screen:', err));
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        showCloseIcon={showCloseIcon}
        className="!max-w-[300px] rounded-[16px] sm:!max-w-sm md:!max-w-sm lg:!max-w-sm"
      >
        <div className="!py-2">
          <DialogHeader>
            <DialogTitle className="mb-2 rounded-[16px] text-center text-lg font-medium text-[#222222] sm:text-xl md:text-xl">
              {MODELMessage.LEAVE_TEST}
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full border border-[#10101026] !px-5 !py-5 text-sm text-[#6F6F6F] hover:text-[#6F6F6F] sm:w-[120px] sm:text-[14px] md:w-[120px] lg:w-[120px]"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="w-full bg-primary !px-5 !py-5 text-sm text-[#FFFFFF] hover:bg-primary/80 sm:w-[120px] sm:text-sm md:w-[120px] lg:w-[120px]"
            size="sm"
            onClick={leaveTestHandler}
          >
            Exit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
