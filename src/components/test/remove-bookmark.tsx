import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MODELMessage, TosterMessages } from '@/types/enum';
import { useEffect, useState } from 'react';
import { deleteBookmark } from '@/utils/api/user/bookmark';
import { useDispatch } from '@/store';
import { getBookmarks } from '@/store/slice/user/bookmarks';
import { toast } from 'sonner';

interface BookmarkRemoveDialogProps {
  questionId?: number;
  studentId?: number;
  isOpen: boolean;
  onClose: () => void;
  showCloseIcon?: boolean;
  selectedBookmarkType?: number;
  onSubmit?: () => void;
}

export default function BookmarkRemoveDialog({
  questionId,
  isOpen,
  onClose,
  showCloseIcon = false,
  studentId,
  selectedBookmarkType,
  onSubmit
}: BookmarkRemoveDialogProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const removeBookmark = async () => {
    setLoading(true);
    try {
      if (selectedBookmarkType && questionId && studentId) {
        await deleteBookmark({ bookmarkType: selectedBookmarkType, questionId, studentId: studentId || 0 });
        dispatch(getBookmarks({ studentId, bookmarkType: selectedBookmarkType }));
      } else {
        onSubmit && onSubmit();
      }
      onClose();
      toast.success(TosterMessages.BOOKMARK_REMOVE_SUCCESS);
    } catch (error) {
      console.error('Error removing bookmark:', error);
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   if (!isOpen) {
  //     setLoading(false);
  //   }
  // }, [isOpen]);
  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseIcon={showCloseIcon} className="!max-w-[300px] sm:!max-w-lg md:!max-w-lg lg:!max-w-lg">
        <div className="!py-3">
          <DialogHeader>
            <DialogTitle className="rounded-[8px] text-center text-[18px] font-medium text-[#222222] sm:text-[20px] md:text-[20px]">
              {MODELMessage.TITLE_REMOVE}
            </DialogTitle>
          </DialogHeader>

          <div className="!py-2">
            <p className="text-center text-[16px] font-normal text-[#6F6F6F] sm:text-[18px]">{MODELMessage.BOOKMARK_TAP}</p>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full border border-[#10101026] !px-5 !py-5 text-[14px] font-medium text-[#6F6F6F] hover:text-[#6F6F6F] sm:w-[120px] md:w-[120px] lg:w-[120px]"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="w-full bg-[#000080] !px-5 !py-5 text-[14px] font-medium text-[#FFFFFF] hover:bg-[#000080] sm:w-[120px] md:w-[120px] lg:w-[120px]"
            size="sm"
            onClick={removeBookmark}
            disabled={loading}
          >
            {/* {loading && <span className="mr-2 animate-spin">⌛</span>} */}
            {loading ? 'Removing...' : 'Remove'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
