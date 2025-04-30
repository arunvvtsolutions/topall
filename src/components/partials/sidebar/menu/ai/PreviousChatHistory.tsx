<<<<<<< HEAD
import { RootState, useDispatch, useSelector } from '@/store';
import { ChatItem, setChatHistory } from '@/store/slice/ai/previousChatSlice';
import { getAiPreviousChatHistory } from '@/utils/api/ai/previousChatHistory';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { BotIcon, ChevronRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
=======
'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, RootState } from '@/store';
import { usePathname, useRouter } from 'next/navigation';
import { getAiPreviousChatHistory } from '@/utils/api/ai/previousChatHistory';
import { setChatHistory, ChatItem } from '@/store/slice/ai/previousChatSlice';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BotIcon, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConfig } from '@/hooks/use-config';

>>>>>>> cfab089 (changes in ui dev + arun)
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
<<<<<<< HEAD
  addedDate: string; // ISO date string
  updatedDate: string; // ISO date string
=======
  addedDate: string;
  updatedDate: string;
>>>>>>> cfab089 (changes in ui dev + arun)
  totalCostUsd: number | null;
  totalTokens: number | null;
  outputTokens: number | null;
  inputTokens: number | null;
  classId: number | null;
}
<<<<<<< HEAD
const PreviousChatHistory = () => {
  const chatHistory = useSelector((state: RootState) => state.aiPreviousChats.previousChatHistory);
  const { userId } = useSelector((state: RootState) => state.userProfile);
  const [previousChatHistory, setPreviousChatHistory] = React.useState<IAiDoubtModuleAnswerProps[]>([]);
  const dispatch = useDispatch();
  const pathname = usePathname();

  console.log("chatHistory",chatHistory);
  
  useEffect(() => {
    if (userId) {
      const fetchAiPerviousChatHistory = async () => {
        const payload = {
          userId: Number(userId),
          botType: 2
        };
        try {
          const res: IAiDoubtModuleAnswerProps[] = await getAiPreviousChatHistory(payload);
          if (res && res.length > 0) {
            // Map to ChatItem[]
            const mappedData = res.map(
              (item): ChatItem => ({
                id: item.id.toString(),
                title: item.title || 'Untitled Chat',
                userId: item.userId.toString(),
                botType: item.botType?.toString() || '0',
                threadId: item.threadId || `thread-${item.id}`,
                createdAt: item.addedDate
              })
            );
            // Dispatch to Redux store
            dispatch(setChatHistory(mappedData));
            setPreviousChatHistory(res);
          }
        } catch (error) {
          console.error('Failed to fetch chat history', error);
        }
      };

      fetchAiPerviousChatHistory();
    }
  }, [userId, dispatch]);

  console.log('userId', userId);
  console.log('chatHistory', chatHistory);
  console.log('pathname', pathname);
  const router = useRouter();

  const handleNavigate = (userId: string, threadId: string) => {
    router.push(`/ai-bot/chapter-bot/${threadId}`);
  };

  return (
    <Accordion type="single" collapsible className="">
      <AccordionItem className='border-0' value="history">
        <AccordionTrigger
          className={cn(
            'flex w-full items-center justify-start gap-2 rounded-lg px-3 py-2 text-left text-[15px]',
            'hover:bg-accent hover:no-underline'
          )}
        >
          <BotIcon className="h-5 w-5" />
          Previous Chat History
        </AccordionTrigger>
        <AccordionContent
          className="scrollbar-hide mt-2 max-h-[200px] overflow-y-scroll no-underline border-0
          [&::-webkit-scrollbar-thumb]:rounded-full 
          [&::-webkit-scrollbar-thumb]:bg-gray-500 
          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 
          [&::-webkit-scrollbar-track]:bg-gray-200 
          dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
          [&::-webkit-scrollbar]:w-1"
        >
          {chatHistory.length === 0 ? (
            <p className="text-sm italic text-gray-500">
              No previous chats found.
            </p>
          ) : (
            <div className="space-y-2">
              {chatHistory.map((item) => (
                <div
                  onClick={() => {
                    if (item.userId && item.threadId) {
                      handleNavigate(item.userId, item.threadId);
                    }
                  }}
                  key={item.id}
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
=======
const BOTS = {
  CHAPTER_BOT: {
    pathname: '/chapter-bot',
    botType: 2
  },
  CAREER_BOT: {
    pathname: '/doubt-ai',
    botType: 1
  },
  TOPIC_BOT: {
    pathname: '/topic-bot',
    botType: 4
  }
};
const PreviousChatHistory = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [config, setConfig] = useConfig();
  const collapsed = config.collapsed;
  console.log('collapsed', collapsed);

  const { userId } = useSelector((state: RootState) => state.userProfile);
  const chatHistory = useSelector((state: RootState) => state.aiPreviousChats.previousChatHistory);
  const [activeChatId, setActiveChatId] = useState<string | null>(null); // 👈 track selected chat
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || !pathname) return;

    const fetchPreviousChats = async () => {
      setLoading(true);
      try {
        const parts = pathname.split('/').filter(Boolean);
        let currentBotType: number | null = null;
        let subjectId: string | number | null = null;
        let chapterId: string | number | null = null;
        let topicId: string | number | null = null;
        // 1. Detect bot type
        for (const key in BOTS) {
          if (parts.includes(BOTS[key as keyof typeof BOTS].pathname.replace('/', ''))) {
            currentBotType = BOTS[key as keyof typeof BOTS].botType;
            break;
          }
        }
        if (!currentBotType) {
          console.error('Could not detect bot type from URL');
          setLoading(false);
          return;
        }
        // 2. Detect ids from URL
        if (currentBotType === BOTS.CHAPTER_BOT.botType) {
          const chapterBotIndex = parts.indexOf('chapter-bot');
          subjectId = parts[chapterBotIndex + 1];
          chapterId = parts[chapterBotIndex + 2];
        } else if (currentBotType === BOTS.TOPIC_BOT.botType) {
          const topicBotIndex = parts.indexOf('topic-bot');
          subjectId = parts[topicBotIndex + 1];
          chapterId = parts[topicBotIndex + 2];
          topicId = parts[topicBotIndex + 3];
        }
        // 3. Switch payload depending on bot type
        let payload: any = {};
        switch (currentBotType) {
          case BOTS.CHAPTER_BOT.botType:
            payload = {
              userId: Number(userId),
              botType: currentBotType
            };
            break;
          case BOTS.TOPIC_BOT.botType:
            payload = {
              userId: Number(userId),
              botType: currentBotType,
              subjectId: subjectId ? Number(subjectId) : undefined,
              chapterId: chapterId ? Number(chapterId) : undefined,
              topicId: topicId ? Number(topicId) : undefined
            };
            break;
          case BOTS.CAREER_BOT.botType:
            payload = {
              userId: Number(userId),
              botType: currentBotType
            };
            break;
          default:
            console.error('Unknown bot type for payload');
            setLoading(false);
            return;
        }
        console.log('Payload sending:', payload);
        const res: IAiDoubtModuleAnswerProps[] = await getAiPreviousChatHistory(payload);
        console.log(res, 'Previous chat history response');
        if (res && res.length > 0) {
          const mappedChats = res.map(
            (item): ChatItem => ({
              id: item.id.toString(),
              title: item.title || 'Untitled Chat',
              userId: item.userId.toString(),
              botType: item.botType?.toString() || '0',
              threadId: item.threadId || `thread-${item.id}`,
              subjectId: item.subjectId?.toString() || null,
              chapterId: item.chapterId?.toString() || null,
              createdAt: item.addedDate
            })
          );
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

      case 1: // Career Bot
        url = `/doubt-ai/${threadId}`;
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
    <AccordionItem className="border-0 mb-0" value="history">
      <AccordionTrigger className={cn('bg-transparent px-3 py-0 mb-0 text-white justify-start' , '')}>
        <BotIcon className=" h-6 w-6 mr-2" />
        <span >Previous History</span>
      </AccordionTrigger>

      <AccordionContent className="scrollbar-hide mt-2 bg-white rounded-sm max-h-52 overflow-y-auto  px-2 py-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-500 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-gray-200 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-1">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 w-full animate-pulse rounded bg-gray-300" />
            ))}
          </div>
        ) : chatHistory.length === 0 ? (
          <p className="text-sm italic text-gray-500">No previous chats found.</p>
        ) : (
          chatHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNavigate(Number(item.botType), item.threadId, item.subjectId, item.chapterId)}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-accent',
                activeChatId === item.id && 'bg-accent'
              )}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="text-sm">{item.title}</span>
            </div>
          ))
        )}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
>>>>>>> cfab089 (changes in ui dev + arun)
  );
};

export default PreviousChatHistory;
