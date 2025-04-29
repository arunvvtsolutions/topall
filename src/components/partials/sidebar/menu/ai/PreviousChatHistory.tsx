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
const BOTS = {
  CHAPTER_BOT: {
    pathname : '/chapter-bot',
    botType: 2,
  },
  CAREER_BOT: {
    pathname : '/doubt-ai',
    botType: 1,
  },
  TOPIC_BOT: {
    pathname : '/topic-bot',
    botType: 4,
  }
}
const PreviousChatHistory = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { userId } = useSelector((state: RootState) => state.userProfile);
  const chatHistory = useSelector((state: RootState) => state.aiPreviousChats.previousChatHistory);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);  // 👈 track selected chat
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
              botType: currentBotType,
            };
            break;
          case BOTS.TOPIC_BOT.botType:
            payload = {
              userId: Number(userId),
              botType: currentBotType,
              subjectId: subjectId ? Number(subjectId) : undefined,
              chapterId: chapterId ? Number(chapterId) : undefined,
              topicId: topicId ? Number(topicId) : undefined,
            };
            break;
          case BOTS.CAREER_BOT.botType:
            payload = {
              userId: Number(userId),
              botType: currentBotType,
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
          const uniqueByThreadId = new Map<string, IAiDoubtModuleAnswerProps>();
          res.forEach((item) => {
            // Check if both threadId and title exist before adding to the map
            if (item.threadId && item.title) {
              if (!uniqueByThreadId.has(item.threadId)) {
                uniqueByThreadId.set(item.threadId, item);
              }
            }
          });
          const uniqueChatsArray = Array.from(uniqueByThreadId.values());
          const mappedChats = uniqueChatsArray.map((item): ChatItem => ({
            id: item.id.toString(),
            title: item.title || 'Untitled Chat',
            userId: item.userId.toString(),
            botType: item.botType?.toString() || '0',
            threadId: item.threadId || `thread-${item.id}`,
            subjectId: item.subjectId?.toString() || null,
            chapterId: item.chapterId?.toString() || null,
            createdAt: item.addedDate,
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
      <AccordionItem className="border-0 bg-t" value="history">
        <AccordionTrigger
          className={cn(
            'flex w-full items-center justify-start gap-2 rounded-lg px-3 py-2 text-left text-[15px]',
            'hover:bg-accent hover:no-underline'
          )}
        >
          <BotIcon className="h-5 w-5" />
          Previous Chat History
        </AccordionTrigger>

        <AccordionContent className="bg-white px-2 py-2 scrollbar-hide mt-2 max-h-[200px] overflow-y-scroll border-0 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-500 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-gray-200 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-1">
          {loading ? (
             <div className="space-y-3 px-2 py-2">
             {[1, 2, 3,4,5,6].map((_, index) => (
               <div key={index} className="h-7 w-full bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
             ))}
           </div>
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
                    setActiveChatId(item.id);   // 👈 set clicked chat as active
                  }
                }}
                className={cn(
                  'cursor-pointer rounded-lg px-2 py-1 transition-all', 
                  activeChatId === item.id ? 'bg-[#000080] text-white' : 'hover:bg-accent'
                )}
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
