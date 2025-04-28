'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './Header';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { BOT_TYPE } from '@/utils/api/ai-doubt-module-dummy';
import { toast } from '@/components/ui/use-toast';
import { getAiBotAnswerByThreadId, postChapterWiseAiBot, postCommonBot } from '@/utils/api/ai';
import { RootState, useSelector } from '@/store';
import { getAiBotsList } from '@/utils/api/ai/ai-bots';
import { getAiTokenById } from '@/utils/api/ai/ai-token';
import { AI } from './types';

interface ChatContainerProps {
  threadId?: string;
  botType?: BOT_TYPE;
  title?: string;
  placeholder?: string;
  welcomeMessage?: string;
  params: any;
  subjectId?: number;
  chapterId?: number;
}

interface Message {
  id: string;
  content: string;
  role: 'assistant' | 'user';
  imageUrl?: string;
  fileName?: string;
  history?: string;
  threadId?: string;
  isTyping?: boolean;
  loading?: boolean;
  assetUrl?: string;
}
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

interface ImageFileProps {
  url?: string;
  fileName?: string;
}
interface IAiBotProps {
  id: number;
  botName: string;
  botType: number;
  shortUrl : string;
  textPromptCredits: number;
  imagePromptCredits: number;
}
interface IAiTokenProps {
  id: number;
  userId: number;
  totalTokens: number;
  remainingTokens: number;
  createdDate: string;
  updatedDate: string;
}
export default function ChatContainer({
  threadId: initialThreadId,
  botType,
  title,
  placeholder,
  welcomeMessage,
  params,
  chapterId,
  subjectId
}: ChatContainerProps) {
  const { userId } = useSelector((state: RootState) => state.userProfile);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<ImageFileProps>({});
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [tokenCount, setTokenCount] = useState<number>(100);
  const [lastMsg, setLastMsg] = useState<string>('');
  const [tokenDetails, setTokenDetails] = useState<IAiTokenProps>();
  const [currentThreadId, setCurrentThreadId] = useState<string>(
    initialThreadId || `${AI.THREAD_KEY}-${uuidv4().substring(0, 21)}`
  );
  
  console.log(tokenDetails, 'tokenDetails');
  const fetchAiTokenByUserId = useCallback(async (userId: number) => {
    try {
      const res: IAiTokenProps = await getAiTokenById(userId);
      if (res) {
        setTokenDetails(res);
      }
      console.log(res, 'token details');
    } catch (error) {
      console.error('Error fetching AI token:', error);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchAiTokenByUserId(userId);
    }
  }, [userId, fetchAiTokenByUserId]);

  useEffect(() => {
    const fetchAiBots = async () => {
      try {
        const res: IAiBotProps[] = await getAiBotsList();
        console.log(res, 'AI Bots List');
      } catch (error) {
        throw error;
      }
    };
    fetchAiBots();

    // Update URL with thread ID if it exists
    if (currentThreadId && !initialThreadId) {
      const pathname = window.location.pathname;
      const basePathname = pathname
        .split('/')
        .filter((part) => !part.startsWith(AI.THREAD_KEY))
        .join('/');
      window.history.pushState({}, '', `${basePathname}/${currentThreadId}`);
    }
  }, [currentThreadId, initialThreadId]);
  useEffect(() => {
    if (initialThreadId) {
      const fetchAiBotAnswer = async () => {
        try {
          const res: IAiDoubtModuleAnswerProps[] = await getAiBotAnswerByThreadId(initialThreadId.toString());
          console.log('AI Bots answers', res);

          // Transform and set the messages
          if (res && res.length > 0) {
            const transformedMessages: Message[] = [];

            res.forEach((answer) => {
              // Add user's question
              if (answer.question) {
                transformedMessages.push({
                  id: uuidv4(),
                  content: answer.question,
                  role: 'user',
                  threadId: answer.threadId || initialThreadId
                });
              }

              // Add bot's answer
              if (answer.answer) {
                transformedMessages.push({
                  id: uuidv4(),
                  content: answer.answer,
                  role: 'assistant',
                  threadId: answer.threadId || initialThreadId,
                  assetUrl: answer.assetUrl || undefined
                });
              }
            });

            setMessages(transformedMessages);
            if (res[0].history) {
              setLastMsg(res[0].history);
            }
          }
        } catch (error) {
          console.error('Error fetching AI bot answers:', error);
          toast({
            title: 'Error',
            description: 'Failed to load chat history. Please try again.',
            variant: 'destructive'
          });
        }
      };
      fetchAiBotAnswer();
    }
  }, [initialThreadId]);

  useEffect(() => {
    if (initialThreadId) {
      setCurrentThreadId(initialThreadId);
    } else {
      setCurrentThreadId(`${AI.THREAD_KEY}-${uuidv4().substring(0, 21)}`);
    }
  }, [initialThreadId]);

  const createNewChat = useCallback(
    (content: string, imageData: ImageFileProps, threadId: string): Message => ({
      id: uuidv4(),
      content,
      role: 'user',
      imageUrl: imageData.url,
      fileName: imageData.fileName,
      loading: false,
      threadId
    }),
    []
  );

  const getRandomResponse = useCallback(
    async (botType: BOT_TYPE | undefined, message: string) => {
      try {
        if (!userId) {
          throw new Error('User ID is required');
        }

        if (!currentThreadId) {
          throw new Error('Thread ID is required');
        }

        if (!botType) {
          throw new Error('Bot type is required');
        }

        const commonRequestData = {
          message,
          userId,
          history: lastMsg,
          threadId: currentThreadId,
          botType
        };

        let apiResponse;

        switch (botType) {
          case BOT_TYPE.ASK_DOUBTS:
            if (!chapterId || !subjectId) {
              throw new Error('Chapter ID is required for chapter bot');
            }
            apiResponse = await postChapterWiseAiBot({
              ...commonRequestData,
              chapterId,
              subjectId
            });
            break;

          case BOT_TYPE.ASK_ADMISSIONS:
            // apiResponse = await postCommonBot({
            //   ...commonRequestData,
            //   chapterId: 0 // Required by IAiDoubtModuleSendProps, using 0 for non-chapter bots
            // });
            break;

          default:
            throw new Error(`Unsupported bot type: ${botType}`);
        }

        console.log('🧠 AI Response:', apiResponse);

        return {
          success: true,
          paymentStatus: true,
          data: {
            answer: apiResponse?.result || 'No response available.',
            history: apiResponse?.history || ''
          }
        };
      } catch (error) {
        console.error('AI Response Error:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'An error occurred while processing your request.',
          variant: 'destructive'
        });
        return {
          success: false,
          paymentStatus: false,
          data: {
            answer: 'An error occurred while processing your request.',
            history: ''
          }
        };
      }
    },
    [chapterId, userId, currentThreadId, lastMsg]
  );

  const getAiResponse = useCallback(
    async (message: string) => {
      const response = await getRandomResponse(botType, message);
      return response;
    },
    [botType, getRandomResponse]
  );

  const handleResponse = useCallback(
    async (result: any, threadId: string) => {
      if (result.success) {
        setMessages((prev) => prev.filter((msg) => !msg.loading));

        const assistantMessage: Message = {
          id: uuidv4(),
          content: result.data.answer,
          role: 'assistant',
          threadId
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setLastMsg(result.data.answer);

        // Update token count after successful response
        if (userId) {
          await fetchAiTokenByUserId(userId);
        }
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to get a response. Please try again.',
          variant: 'destructive'
        });
        setMessages((prev) => prev.filter((msg) => !msg.loading));
      }
    },
    [userId, fetchAiTokenByUserId]
  );

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() && !imageFile.url) return;

      try {
        // Ensure we have a thread ID
        const threadId = currentThreadId || `${AI.THREAD_KEY}-${uuidv4().substring(0, 21)}`;
        if (!currentThreadId) {
          setCurrentThreadId(threadId);
          const pathname = window.location.pathname;
          const basePathname = pathname
            .split('/')
            .filter((part) => !part.startsWith(AI.THREAD_KEY))
            .join('/');
          window.history.pushState({}, '', `${basePathname}/${threadId}`);
        }

        const userMessage = createNewChat(content, imageFile, threadId);
        setMessages((prev) => [...prev, userMessage]);

        if (imageFile.url) setImageFile({});

        const loadingMessage: Message = {
          id: uuidv4(),
          content: '',
          role: 'assistant',
          isTyping: false,
          loading: true,
          threadId: currentThreadId
        };
        setMessages((prev) => [...prev, loadingMessage]);

        const result = await getAiResponse(content);
        handleResponse(result, currentThreadId);

        if (result.success) {
          // Decrement token count by 1 for each message
          setTokenCount((prev) => Math.max(0, prev - 1));
        }
      } catch (error) {
        console.error('Error in send message flow:', error);
        toast({
          title: 'Error',
          description: 'Failed to get a response. Please try again.',
          variant: 'destructive'
        });
        setMessages((prev) => prev.filter((msg) => !msg.loading));
      }
    },
    [imageFile, currentThreadId, createNewChat, getAiResponse, handleResponse]
  );

  const handleNewChat = useCallback(() => {
    // Only proceed if there are messages
    if (messages.length === 0) return;

    setIsLoading(false);
    setActiveMessageId(null);
    setLastMsg('');
    setImageFile({});
    const newThreadId = `${AI.THREAD_KEY}-${uuidv4().substring(0, 21)}`;
    setCurrentThreadId(newThreadId);

    if (welcomeMessage) {
      setMessages([
        {
          id: uuidv4(),
          content: welcomeMessage,
          role: 'assistant',
          threadId: newThreadId
        }
      ]);
    } else {
      setMessages([]);
    }

    setTokenCount(100);

    // Update URL with new thread ID
    const pathname = window.location.pathname;
    const basePathname = pathname
      .split('/')
      .filter((part) => !part.startsWith(AI.THREAD_KEY))
      .join('/');
    window.history.pushState({}, '', `${basePathname}/${newThreadId}`);
  }, [welcomeMessage, messages.length]);

  const isChatLoading = useMemo(() => isLoading || activeMessageId !== null, [isLoading, activeMessageId]);
  const chatTitle = title || 'AI Assistant';
  const chatPlaceholder = placeholder || 'Type your message here...';

  return (
    <div className="flex items-center justify-center">
      <div className="flex h-[90vh] w-[90%] max-w-[1000px] flex-col">
        <Header title={chatTitle} onNewChat={handleNewChat} disableNewChat={messages.length === 0} />
        <div className="relative flex-1 overflow-hidden">
          <MessageList messages={messages} isLoading={isLoading} />
        </div>
        <div className="flex-none">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading}
            isCustomized={true}
            textAreaPlaceholder={chatPlaceholder}
          />
          <div className="mt-[5px] w-full">
            <p className="text-center !text-[14px]">
              <span className="block text-[12px] text-[#8B8B8B]">Our bots make mistakes. Double-check important details.</span>
              {AI.TOKEN_COUNT} <span className="font-bold">{tokenDetails?.remainingTokens}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
