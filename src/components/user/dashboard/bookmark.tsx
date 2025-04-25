'use client';
import React, { useEffect, useState } from 'react';
import qustionsData from '../bookmarks/questions.json';
import QuestionCard from '../answer-key/question-card';
import { useDispatch, useSelector } from '@/store';
import { deleteBookmark } from '@/utils/api/user/bookmark';
import { toast } from 'sonner';
import { TosterMessages } from '@/types/enum';
import BookmarkRemoveDialog from '@/components/test/remove-bookmark';
import BookmarkCard from '../bookmarks/BookmarkCard';
import { set } from 'date-fns';
import { IBookmarksProps } from '@/types';
import { getBookmarks } from '@/store/slice/user/bookmarks';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const Bookmarks = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { userId } = useSelector((state) => state.userProfile);
  const { bookMarkLists } = useSelector((state) => state.bookmarks);

  const [removeBookmark, setRemoveBookmark] = useState<boolean>(false);
  const [bookmarkIdToRemove, setBookmarkIdToRemove] = useState<number>(0);
  const [bookmarkTypeToRemove, setBookmarkTypeToRemove] = useState<number>(0);
  // const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const removeBookmarkConfirmHandler = async () => {
    await deleteBookmark({ bookmarkType: bookmarkTypeToRemove, questionId: bookmarkIdToRemove, studentId: userId || 0 });
    dispatch(getBookmarks({ studentId: userId, bookmarkType: 0 }));
    setBookmarkIdToRemove(0);
    setBookmarkTypeToRemove(0);
    setRemoveBookmark(false);
  };

  const removeBookmarkHandler = (questionId: number, bookmarkType: number) => {
    setBookmarkIdToRemove(questionId);
    setBookmarkTypeToRemove(bookmarkType);
    setRemoveBookmark(true);
  };

  useEffect(() => {
    if (userId) dispatch(getBookmarks({ studentId: userId, bookmarkType: 0 }));
  }, [userId]);

  if (bookMarkLists.length === 0) return null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mr-5 inline-block text-base font-medium text-B2CAgrayn lg:text-xl">Bookmarks</h3>
        <Button onClick={() => router.push('/bookmarks')} variant="default" color="secondary" size="md" className="text-primary">
          View All
        </Button>
      </div>
      {bookMarkLists.slice(0, 5).map((question: any, index: number) => (
        <BookmarkCard
          question={question}
          qCardType="bookmark"
          index={index}
          handleDelete={removeBookmarkHandler}
          key={question.questionId}
        />
      ))}

      {removeBookmark && (
        <BookmarkRemoveDialog
          onSubmit={removeBookmarkConfirmHandler}
          isOpen={removeBookmark}
          onClose={() => {
            setRemoveBookmark(false);
            setBookmarkIdToRemove(0);
            setBookmarkTypeToRemove(0);
          }}
        />
      )}
    </div>
  );
};

export default Bookmarks;
