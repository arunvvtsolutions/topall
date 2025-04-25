'use client';
import Paginate from '@/components/common/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResultTitle, TosterMessages } from '@/types/enum';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import ChapterWiseCard from './chapter-wise-card';
import { useSelector } from '@/store';
import axios from 'axios';
import { getChapterWiseTests, getLevelList, practiceChapterWiseTest } from '@/utils/api/user/chapter-wise-test';
import { GenericType } from '@/types';
import { useRouter } from 'next/navigation';
import { ChapterWIseTests } from '@/types/user';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toast } from 'sonner';
import SectionHeader from '@/components/common/section-heading';
import { LucideLoader } from '@/components/common/LucideLoader';
import { encryptId } from '@/utils/crypto';
import { OnlineExamination } from '@/types/online-exams';
import { clearDB, saveTestState } from '@/services/indexed-db';

const ChapterWiseTabs: React.FC = () => {
  const studentId = useSelector((state) => state.user.userId);
  // const standard = useSelector((state) => state.user.standard);
  const subjects = useSelector((state) => state.user.subjects);
  const stream = useSelector((state) => state.stream.stream);
  const standardId = useSelector((state) => state.stream.standard);

  const [chapterWiseTests, setChapterWiseTests] = useState<ChapterWIseTests[]>([]);
  const [activeTab, setActiveTab] = useState(subjects[0]?.id);
  const [levelList, setLevelList] = useState<GenericType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingChapterId, setLoadingChapterId] = useState<number | null>(null);
  const router = useRouter();

  // Tab Change Handler
  const handleTabChange = (tabId: number) => {
    setActiveTab(tabId);
    fetchChapterwiseTests(tabId);
  };

  // GET API for fetching chapter-wise tests
  const fetchChapterwiseTests = async (subjectId: number) => {
    setLoading(true);
    try {
      if (stream && standardId?.id) {
        const response = await getChapterWiseTests({
          subjectId,
          standardId: standardId?.id,
          studentId,
          streamId: stream?.id
        });
        setChapterWiseTests(response);
      }
      await clearDB();
    } catch (error) {
      toast.error(TosterMessages.ADMIN_COMMON_ERROR);
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  // GET API for fetching the level list
  const fetchLevelList = async (streamId: number) => {
    try {
      const response = await getLevelList(streamId);
      setLevelList(response);
    } catch (error) {
      toast.error(TosterMessages.ADMIN_COMMON_ERROR);
      console.log('error', error);
    }
  };

  // Start Chapter Wise Test
  const handlePractice = async (chapterId: number, levelId: number) => {
    if (!stream || !studentId || !chapterId || !levelId || !activeTab) return;
    setLoadingChapterId(chapterId);
    try {
      const payload = {
        streamId: stream.id,
        studentId,
        chapterId,
        level: levelId,
        subjectId: activeTab
      };

      const response = await practiceChapterWiseTest(payload);

      if (response) {
        const encryptedId = encodeURIComponent(encryptId(response.testId));
        const saveTestDBPayload = {
          testype_Id: response.testType,
          is_submited: false,
          offline: [],
          status: OnlineExamination.START_TEST,
          testId: String(response.testId),
          onlineCurrentView: OnlineExamination.INSTRUCTION
        };
        await saveTestState(String(response.testId), saveTestDBPayload);
        router.push(`/test?id=${encryptedId}`);
      }
    } catch (error) {
      toast.error(TosterMessages.ADMIN_COMMON_ERROR);
      console.log('error', error);
    } finally {
      setLoadingChapterId(null);
    }
  };

  useEffect(() => {
    if (subjects && subjects.length > 0) {
      setActiveTab(subjects[0].id);
      fetchChapterwiseTests(subjects[0].id);
    }
  }, [subjects, stream?.id]);

  useEffect(() => {
    if (stream?.id) {
      fetchLevelList(stream.id);
    }
  }, [stream]);

  return (
    <div className="flex h-full min-h-screen flex-col">
      <SectionHeader title={ResultTitle.CHAPTER_WISE} />

      {/* Sticky Tabs */}
      <div className="sticky top-[60px] z-10 bg-white pt-4 md:pt-6">
        <Tabs defaultValue={subjects[0]?.name}>
          <div className="scrollbar-hide overflow-x-auto">
            <TabsList className="border-[rgba(16, 16, 16, 0.15)] mx-auto mb-4 flex w-max min-w-[520px] items-center justify-between rounded-[8px] border border-b-2 bg-white px-4 py-2 md:min-w-[780px] md:px-16 md:py-4">
              {subjects.map((subject) => (
                <TabsTrigger
                  key={subject.id}
                  value={subject.name}
                  onClick={() => handleTabChange(subject.id)}
                  className={clsx(
                    'mb-0 flex items-center justify-center bg-transparent p-0 text-[16px] font-normal text-[#6F6F6F] md:text-[20px]',
                    activeTab === subject.id && 'border-b-2 border-[#000080] pb-2 text-[#000080]'
                  )}
                >
                  {subject.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      </div>

      {/* Scrollable Area for Chapter Wise Cards */}
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <LucideLoader className="h-8 w-8 text-primary" />
        </div>
      ) : chapterWiseTests && chapterWiseTests.length > 0 ? (
        <ScrollArea className="flex-1 px-4">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {chapterWiseTests.length > 0 &&
              chapterWiseTests?.map((chapter) => (
                <ChapterWiseCard
                  key={chapter.chapterId}
                  chapter={chapter}
                  levels={levelList}
                  onChange={handlePractice}
                  isPractice={loadingChapterId === chapter.chapterId}
                />
              ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex h-full flex-1 items-center justify-center px-4">
          <p className="text-center text-base font-medium text-[#6F6F6F] md:text-lg">No tests found.</p>
        </div>
      )}
    </div>
  );
};

export default ChapterWiseTabs;
