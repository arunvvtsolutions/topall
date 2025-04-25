'use client';

import { LucideLoader } from '@/components/common/LucideLoader';
import SectionHeader from '@/components/common/section-heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDispatch, useSelector } from '@/store';
import { getConceptWishTest } from '@/store/slice/user/concept';
import { getStreamById } from '@/utils/api/academic';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import ChapterAccordion from './chapter-accordion';
import { startConceptWiseTest } from '@/utils/api/user/chapter-wise-test';
import { encryptId } from '@/utils/crypto';
import { OnlineExamination } from '@/types/online-exams';
import { clearDB, saveTestState } from '@/services/indexed-db';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { TosterMessages } from '@/types/enum';

type Subject = {
  subject_id: number;
  subjectName: string;
  is_active: boolean;
};

const ConceptTest: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const concepts = useSelector((state) => state.conceptTest.concepts);
  const userId = useSelector((state) => state.userProfile.userId);
  const selectedStream = useSelector((state) => state.stream.stream);
  const selectedStandard = useSelector((state) => state.stream.standard);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeTab, setActiveTab] = useState<Subject | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isTopicLoading, setIsTopicLoading] = useState<number | null>(null);

  useEffect(() => {
    const fetchSubjectData = async () => {
      if (!selectedStream) return;
      setLoading(true);
      try {
        const response = await getStreamById(selectedStream.id);
        if (response?.stream_subjects?.length > 0) {
          setSubjects(response.stream_subjects);
          setActiveTab(response.stream_subjects[0]);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectData();
  }, [selectedStream]);

  useEffect(() => {
    if (activeTab && selectedStream && userId && selectedStandard) {
      const getData = async () => {
        setLoading(true);
        try {
          await dispatch(getConceptWishTest(activeTab.subject_id, selectedStandard.id, userId, selectedStream.id));
          await clearDB();
        } finally {
          setLoading(false);
        }
      };
      if (activeTab && selectedStream && userId && selectedStandard) getData();
    }
  }, [activeTab, selectedStream, userId, selectedStandard, dispatch]);

  // Handle tab change
  const handleTabChange = (subject: Subject) => {
    setActiveTab(subject);
  };

  // Start Chapter Wise Test
  const handleStartTest = useCallback(
    async (topicId: number, chapterId: number, topicQuesCount: number) => {
      if (!selectedStream || !userId || !chapterId || !topicId || !topicQuesCount || !activeTab) return;

      setIsTopicLoading(topicId);
      try {
        const payload = {
          studentId: userId,
          streamId: selectedStream.id,
          subjectId: activeTab.subject_id,
          chapterId: chapterId,
          topicId: topicId,
          topicQuesCount: topicQuesCount
        };

        const response = await startConceptWiseTest(payload);

        if (response) {
          const encryptedId = encodeURIComponent(encryptId(response.testId));
          const saveTestDBPayload = {
            ...payload,
            testype_Id: response.testTypeId,
            is_submited: false,
            offline: [],
            status: OnlineExamination.START_TEST,
            testId: response.testId,
            onlineCurrentView: OnlineExamination.INSTRUCTION
          };
          await saveTestState(String(response.testId), saveTestDBPayload);
          router.push(`/test?id=${encryptedId}`);
        }
      } catch (error) {
        toast.error(TosterMessages.ADMIN_COMMON_ERROR);
        console.log('error', error);
      } finally {
        setIsTopicLoading(null);
      }
    },
    [selectedStream, userId, activeTab, router]
  );

  return (
    <div className="h-screen">
      <div>
        <SectionHeader title="Concept Test" />
      </div>

      <div className="flex-grow overflow-y-auto pb-16">
        {loading && subjects.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <LucideLoader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue={subjects[0]?.subjectName} className="pt-4 md:pt-6">
            <div className="scrollbar-hide overflow-x-auto">
              <TabsList className="border-[rgba(16, 16, 16, 0.15)] mx-auto mb-6 flex w-max min-w-[26.25rem] justify-between rounded-[0.5rem] border border-b-2 bg-white px-4 py-2 md:h-[3.5rem] md:min-w-[48.75rem] md:px-16 md:py-4">
                {subjects.map((subject) => (
                  <TabsTrigger
                    key={subject.subject_id}
                    value={subject.subjectName}
                    onClick={() => handleTabChange(subject)}
                    className={clsx(
                      'mb-0 flex items-center justify-center bg-transparent p-0 text-base font-normal text-B2Cgray transition-all duration-300 ease-in-out md:-mt-2 md:!text-xl',
                      activeTab?.subject_id === subject.subject_id &&
                        '-mb-[10px] border-b-2 border-primary bg-transparent pb-2 !text-primary',
                      'md:-mb-5 md:pb-2'
                    )}
                  >
                    {subject.subjectName}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <div className="flex-grow overflow-y-auto pb-16">
              {subjects.map((subject) => (
                <TabsContent key={subject.subject_id} value={subject.subjectName}>
                  {loading ? (
                    <div className="flex items-center justify-center py-10">
                      <LucideLoader className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : concepts.length === 0 ? (
                    <div className="text-center text-gray-500">No concepts found.</div>
                  ) : (
                    <div className="grid gap-4">
                      <ChapterAccordion chapters={concepts} onStart={handleStartTest} isTopicLoading={isTopicLoading} />
                    </div>
                  )}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ConceptTest;
