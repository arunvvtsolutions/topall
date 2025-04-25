'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

import SectionHeader from '@/components/common/section-heading';
import { deleteBookmark, getBookmarks, getBookmarkTypes } from '@/utils/api/user/bookmark';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import GenerateLanding from '../generate-test/generate-landing';
import BookmarkCard from './BookmarkCard';
import { IBookmarksProps } from '@/types';

interface IBookmarkType {
  id: number;
  name: string;
}

function Bookmarks() {
  const { data } = useSession();
  const [selected, setSelected] = useState(0); // Track selected button
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [bookmarkTypes, setBookmarkTypes] = useState<IBookmarkType[]>([]);
  const [bookmarks, setBookmarks] = useState<IBookmarksProps[]>([]);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const handleGetBoomarks = async (bookmarkType: number) => {
    setBookmarkLoading(true);
    setSelected(bookmarkType);
    const bookmarks = await getBookmarks({ studentId: data?.user.id || 0, bookmarkType });
    setBookmarks(bookmarks);
    setLoading(false);
    setBookmarkLoading(false);
  };

  const handleDelete = async (questionId: number, testTypeId = 0) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.questionId !== questionId));
    await deleteBookmark({ bookmarkType: selected, questionId, studentId: data?.user.id || 0 });
  };

  useEffect(() => {
    const getData = async () => {
      const bookmarkTypes = await getBookmarkTypes();
      await handleGetBoomarks(bookmarkTypes[0].id);
      setBookmarkTypes(bookmarkTypes);
    };
    getData();
  }, [data?.user]);
  return (
    <>
      <SectionHeader title="Bookmarks" />

      <div className="ml-6 mt-7 overflow-x-auto pb-2">
        {loading && (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          </div>
        )}
        <div className="flex w-max flex-nowrap gap-4">
          {!loading &&
            bookmarkTypes.map((btn) => (
              <Button
                key={btn.id}
                size="md"
                onClick={() => handleGetBoomarks(btn.id)}
                className={`min-w-max rounded-lg border border-[#10101026] px-4 py-2 ${
                  selected === btn.id
                    ? 'bg-[#00A86B] text-[#FFFFFF] hover:bg-[#00A86B]'
                    : 'bg-[#FFFFFF] text-[#6F6F6F] hover:bg-gray-200'
                }`}
              >
                {btn.name}
              </Button>
            ))}
        </div>
      </div>
      <div className="mt-1">
        <div className="mt-1 gap-3 p-5 pt-1 sm:pt-2">
          <div className="mt-4 gap-3 space-y-4">
            {!loading &&
              (bookmarkLoading ? (
                <div className="flex min-h-[200px] items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </div>
              ) : bookmarks.length === 0 ? (
                <GenerateLanding description="No bookmarks found! Add your favorite resources for quick and easy access." />
              ) : (
                bookmarks.map((question, index) => (
                  <BookmarkCard
                    key={question.questionId}
                    question={question}
                    qCardType="bookmark"
                    // showAnswer={true}
                    index={index}
                    // onShowAnswer={() => setShowAnswer(!showAnswer)}
                    handleDelete={handleDelete}
                  />
                ))
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Bookmarks;
