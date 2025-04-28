'use client';
import { memo, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MainDialog } from '../common/MainDialog';
import clsx from 'clsx';
import { addBookmark } from '@/utils/api/user/bookmark';
import { GenericType } from '@/types';
import { toast } from 'sonner';
import { TosterMessages } from '@/types/enum';
import { HttpStatus } from '@/types/constants';
import { LucideLoader } from '../common/LucideLoader';
import { useDispatch } from '@/store';
import { getBookmarks, getBookmarkTypes } from '@/store/slice/user/bookmarks';

type BookmarkFormProps = {
  isOpen: boolean;
  onClose: any;
  showCloseButton?: boolean;
  questionId?: number;
  studentId?: number;
  testType?: number;
  bookmarkTypes?: GenericType[];
  selectedBookmarkType?: number;
  changeBookmarkType?: (id: number) => void;
};

const BookmarkForm: React.FC<BookmarkFormProps> = ({
  isOpen,
  onClose,
  showCloseButton,
  questionId,
  studentId,
  testType,
  bookmarkTypes,
  selectedBookmarkType,
  changeBookmarkType
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle category click
  const handleCategoryClick = (bookamrk: number) => {
    changeBookmarkType && changeBookmarkType(bookamrk);
  };

  // console.log('bookmarkTypes', bookmarkTypes);

  // Close modal (called on Cancel or Add)
  const closeModal = () => {
    changeBookmarkType && changeBookmarkType(0);
    onClose(); // Reset selected category
  };

  // Handle Add action
  const handleAdd = async () => {
    setIsLoading(true);
    if (!questionId || !studentId || !testType || !selectedBookmarkType) {
      toast.info('Missing required data.');
      return;
    }

    const payload = {
      questionId,
      studentId: studentId,
      testType,
      bookmarkType: selectedBookmarkType
    };

    // console.log('payload', payload);
    if (selectedBookmarkType !== 0) {
      try {
        const response = await addBookmark(payload);
        if (response.status !== HttpStatus.CREATED) {
          toast.error(TosterMessages.BOOKMARK_ERROR);
          return;
        }

        if (response.data.statusCode === HttpStatus.CONFLICT) {
          toast.error(response.data.message || TosterMessages.BOOKMARK_ERROR);
          return;
        }

        dispatch(getBookmarks({ studentId, bookmarkType: selectedBookmarkType }));
        toast.success(TosterMessages.BOOKMARK_SUCCESS);
      } catch (error) {
        toast.error(TosterMessages.BOOKMARK_ERROR);
        console.log(error);
      } finally {
        closeModal();
        setIsLoading(false);
      }
    } else {
      toast.info('Please select a category');
    }
  };

  return (
    <MainDialog isOpen={isOpen} onOpenChange={onClose} size="default" className="!p-0 !pt-0" showCloseButton={showCloseButton}>
      <CardHeader>
        <CardTitle className="pb-3 text-center text-[20px] font-medium text-[#000080]">BOOKMARK</CardTitle>
        <div className="h-[1px] w-full border-b border-[#10101026]"></div>
      </CardHeader>
      <CardContent className="space-y-2">
        {bookmarkTypes &&
          bookmarkTypes.map((bookmarkType, index) => (
            <div
              key={index}
              className={clsx(
                'cursor-pointer rounded-lg border border-[#10101026] bg-[#FFFFFF] p-2 text-start transition-colors',
                selectedBookmarkType === bookmarkType.id
                  ? 'border-[#000080] bg-[#E0E0FF]' // Highlighted when selected
                  : 'hover:border-[#10101026] hover:bg-[#10101026]'
              )}
              onClick={() => handleCategoryClick(bookmarkType.id)}
            >
              <span
                className={clsx(
                  '!text-[16px] font-normal',
                  selectedBookmarkType === bookmarkType.id ? 'font-semibold text-[#000080]' : 'text-[#6F6F6F]'
                )}
              >
                {bookmarkType.name}
              </span>
            </div>
          ))}
      </CardContent>

      <CardFooter className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Button
          variant="outline"
          className="rounded-[8px] border border-[#10101026] text-[14px] font-medium text-[#6F6F6F] hover:text-[#6F6F6F]"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          className="rounded-[8px] bg-[#000080] text-[14px] font-medium text-[#FFFFFF] hover:bg-primary hover:text-[#FFFFFF]"
          onClick={handleAdd}
          disabled={isLoading}
        >
          {isLoading && <LucideLoader className="mr-2" />}
          Add
        </Button>
      </CardFooter>
    </MainDialog>
  );
};

export default memo(BookmarkForm);
