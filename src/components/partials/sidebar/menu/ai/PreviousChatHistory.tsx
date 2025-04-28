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
  addedDate: string; // ISO date string
  updatedDate: string; // ISO date string
  totalCostUsd: number | null;
  totalTokens: number | null;
  outputTokens: number | null;
  inputTokens: number | null;
  classId: number | null;
}
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
  );
};

export default PreviousChatHistory;
