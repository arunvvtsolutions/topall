'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, RootState } from '@/store';
import { usePathname, useRouter } from 'next/navigation';
import { getAiPreviousChatHistory } from '@/utils/api/ai/previousChatHistory';
import { setChatHistory, ChatItem } from '@/store/slice/ai/previousChatSlice';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BotIcon, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IAiDoubtModuleAnswerProps {
  id: number;
  userId: number;
  subjectId: number | null;
  title: string | null;
  threadId: string | null;
  answer: string | null;
  botType: number | null;
  chapterId: number | null;
  topicId: number | null;
  question: string | null;
  assetUrl: string | null;
  history: string | null;
  deleteStatus: number;
  addedDate: string;
  updatedDate: string;
  totalCostUsd: number | null;
  totalTokens: number | null;
  outputTokens: number | null;
  inputTokens: number | null;
  classId: number | null;
}

const PreviousChatHistory = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { userId } = useSelector((state: RootState) => state.userProfile);
  const chatHistory = useSelector((state: RootState) => state.aiPreviousChats.previousChatHistory);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || !pathname) return;

    const fetchPreviousChats = async () => {
      setLoading(true);

      try {
        const parts = pathname.split('/').filter(Boolean);

        let botType: number | null = null;

        if (parts.includes('chapter-bot')) {
          botType = 2;
        }
        // (future: you can add more like 'career-bot', etc.)

        if (!botType) {
          console.error('Could not detect bot type from URL');
          setLoading(false);
          return;
        }

        const payload = {
          userId: Number(userId),
          botType,
        };

        const res: IAiDoubtModuleAnswerProps[] = await getAiPreviousChatHistory(payload);

        if (res && res.length > 0) {
          const mappedChats = res.map((item): ChatItem => ({
            id: item.id.toString(),
            title: item.title || 'Untitled Chat',
            userId: item.userId.toString(),
            botType: item.botType?.toString() || '0',
            threadId: item.threadId || `thread-${item.id}`,
            subjectId: item.subjectId?.toString() || null,
            chapterId: item.chapterId?.toString() || null,
            createdAt: item.addedDate
          }));

          dispatch(setChatHistory(mappedChats));
        }
      } catch (error) {
        console.error('Failed to fetch previous chat history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousChats();
  }, [userId, pathname, dispatch]);

  const handleNavigate = (
    botType: number,
    threadId: string,
    subjectId?: string | number | null,
    chapterId?: string | number | null,
    topicId?: string | number | null
  ) => {
    let url = '';

    switch (botType) {
      case 2: // Chapter Bot
        if (subjectId !== null && chapterId !== null) {
          url = `/chapter-bot/${subjectId}/${chapterId}/${threadId}`;
        }
        break;

      case 3: // Career Bot
        url = `/career-bot/${threadId}`;
        break;

      case 4: // Topic Bot
        if (subjectId !== null && chapterId !== null && topicId !== null) {
          url = `/topic-bot/${subjectId}/${chapterId}/${topicId}/${threadId}`;
        }
        break;

      case 5: // Admission Bot
        url = `/admission-bot/${threadId}`;
        break;

      default:
        console.error('Unknown bot type:', botType);
        return;
    }

    if (url) {
      router.push(url);
    }
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem className="border-0" value="history">
        <AccordionTrigger
          className={cn(
            'flex w-full items-center justify-start gap-2 rounded-lg px-3 py-2 text-left text-[15px]',
            'hover:bg-accent hover:no-underline'
          )}
        >
          <BotIcon className="h-5 w-5" />
          Previous Chat History
        </AccordionTrigger>

        <AccordionContent className="scrollbar-hide mt-2 max-h-[200px] overflow-y-scroll border-0 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-500 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-gray-200 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-1">
          {loading ? (
            <p className="text-sm italic text-gray-500">Loading...</p>
          ) : chatHistory.length === 0 ? (
            <p className="text-sm italic text-gray-500">No previous chats found.</p>
          ) : (
            <div className="space-y-2">
              {chatHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.threadId && item.botType) {
                      handleNavigate(
                        Number(item.botType),
                        item?.threadId,
                        item?.subjectId,
                        item?.chapterId,
                      );
                    }
                  }}
                  className="cursor-pointer rounded-lg border bg-slate-100 px-2 py-1.5 hover:bg-accent"
                >
                  <p className="flex items-center gap-2 text-[15px]">
                    <ChevronRight className="h-4 w-4" />
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PreviousChatHistory;
