'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Header from './Header'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import { BOT_TYPE } from '@/utils/api/ai-doubt-module-dummy'
import { toast } from '@/components/ui/use-toast'
import { getAiBotAnswerByThreadId, postChapterWiseAiBot, postDoubtAiBot } from '@/utils/api/ai'
import { RootState, useDispatch, useSelector } from '@/store'
import { getAiBotsList } from '@/utils/api/ai/ai-bots'
import { getAiTokenById } from '@/utils/api/ai/ai-token'
import { addChatHistoryItem, ChatItem, setChatHistory } from '@/store/slice/ai/previousChatSlice'
import { AI } from './types'

interface PromptCard {
  id: number
  title: string
  prompt: string
  onSendMessage: (message: string) => void
}

interface ChatContainerProps {
  threadId?: string
  botType?: BOT_TYPE
  title?: string
  placeholder?: string
  welcomeMessage?: string
  params: any
  subjectId?: number
  chapterId?: number
  prompts?: PromptCard[]
  subjectName?:string
}

interface Message {
  id: string
  content: string
  role: 'assistant' | 'user'
  assetUrl?: string
  fileName?: string
  history?: string
  threadId?: string
  isTyping?: boolean
  loading?: boolean
}

export interface IAiDoubtModuleAnswerProps {
  id: number
  userId: number
  subjectId: number | null
  title: string | null
  threadId: string | null
  answer: string | null
  botType: number | null
  chapterId: number | null
  topicId: number | null
  question: string | null
  assetUrl: string | null
  history: string | null
  deleteStatus: number
  addedDate: string
  updatedDate: string
  totalCostUsd: number | null
  totalTokens: number | null
  outputTokens: number | null
  inputTokens: number | null
  classId: number | null
}

interface ImageFileProps {
  url?: string
  fileName?: string
}

interface IAiBotProps {
  id: number
  botName: string
  botType: number
  shortUrl: string
  textPromptCredits: number
  imagePromptCredits: number
}

interface IAiTokenProps {
  id: number
  userId: number
  totalTokens: number
  remainingTokens: number
  createdDate: string
  updatedDate: string
}

export default function ChatContainer({
  threadId: initialThreadId,
  botType,
  title,
  placeholder,
  welcomeMessage,
  params,
  chapterId,
  subjectId,
  prompts,
  subjectName
}: ChatContainerProps) {
  const { userId, standard } = useSelector((state: RootState) => state.userProfile)
  const { standards } = useSelector((state: RootState) => state.selectors)
  const dispatch = useDispatch()

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<ImageFileProps>({})
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null)
  const [tokenCount, setTokenCount] = useState<number>(100)
  const [lastMsg, setLastMsg] = useState<string>('')
  const [tokenDetails, setTokenDetails] = useState<IAiTokenProps>()
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(initialThreadId || null)

  const fetchAiTokenByUserId = useCallback(async (userId: number) => {
    try {
      const res: IAiTokenProps = await getAiTokenById(userId)
      if (res) {
        setTokenDetails(res)
      }
    } catch (error) {
      console.error('Error fetching AI token:', error)
    }
  }, [])

  useEffect(() => {
    if (userId) {
      fetchAiTokenByUserId(userId)
    }
  }, [userId, fetchAiTokenByUserId])

  useEffect(() => {
    const fetchAiBots = async () => {
      try {
        const res: IAiBotProps[] = await getAiBotsList()
        console.log(res, 'AI Bots List')
      } catch (error) {
        throw error
      }
    }
    fetchAiBots()
  }, [])

  useEffect(() => {
    if (initialThreadId) {
      const fetchAiBotAnswer = async () => {
        try {
          const res: IAiDoubtModuleAnswerProps[] = await getAiBotAnswerByThreadId(initialThreadId.toString())
          console.log('AI Bots answers', res)

          if (res && res.length > 0) {
            const transformedMessages: Message[] = []

            res.forEach((answer) => {
              if (answer.question || answer.assetUrl) {
                transformedMessages.push({
                  id: uuidv4(),
                  content: answer.question || '',
                  role: 'user',
                  threadId: answer.threadId || initialThreadId,
                  assetUrl: answer.assetUrl || undefined,
                  fileName: answer.assetUrl ? 'Uploaded image' : undefined
                })
              }

              if (answer.answer) {
                transformedMessages.push({
                  id: uuidv4(),
                  content: answer.answer,
                  role: 'assistant',
                  threadId: answer.threadId || initialThreadId,
                })
              }
            })

            setMessages(transformedMessages)
            if (res[0].history) {
              setLastMsg(res[0].history)
            }
          }
        } catch (error) {
          console.error('Error fetching AI bot answers:', error)
          toast({
            title: 'Error',
            description: 'Failed to load chat history. Please try again.',
            variant: 'destructive'
          })
        }
      }
      fetchAiBotAnswer()
    }
  }, [initialThreadId])

  useEffect(() => {
    if (initialThreadId) {
      setCurrentThreadId(initialThreadId)
    }
  }, [initialThreadId])

  const createNewChat = useCallback(
    (content: string, assetUrl: string | undefined, threadId: string): Message => ({
      id: uuidv4(),
      content,
      role: 'user',
      assetUrl: assetUrl,
      loading: false,
      threadId
    }),
    []
  )

  const getRandomResponse = useCallback(
    async (botType: BOT_TYPE | undefined, message: string, assetUrl?: string, threadId?: string) => {
      try {
        if (!userId) {
          throw new Error('User ID is required')
        }

        if (!threadId) {
          throw new Error('Thread ID is required')
        }

        if (!botType) {
          throw new Error('Bot type is required')
        }

        const commonRequestData = {
          message,
          userId,
          history: lastMsg,
          threadId: threadId,
          botType
        }

        let apiResponse

        switch (botType) {
          case BOT_TYPE.ASK_DOUBTS:
            if (!chapterId || !subjectId) {
              throw new Error('Chapter ID is required for chapter bot')
            }
            apiResponse = await postChapterWiseAiBot({
              ...commonRequestData,
              chapterId,
              subjectId,
              assetUrl,
            })
            break

          case BOT_TYPE.COMMON_BOT:
            apiResponse = await postDoubtAiBot({
              ...commonRequestData,
              chapterId: 0,
              subjectId: 0,
              assetUrl
            })
            break

          default:
            throw new Error(`Unsupported bot type: ${botType}`)
        }

        console.log(apiResponse)

        return {
          success: true,
          paymentStatus: true,
          data: {
            answer: apiResponse?.result || 'No response available.',
            history: apiResponse?.history || ''
          },
          botData: apiResponse
        }
      } catch (error) {
        console.error('AI Response Error:', error)
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'An error occurred while processing your request.',
          variant: 'destructive'
        })
        return {
          success: false,
          paymentStatus: false,
          data: {
            answer: 'An error occurred while processing your request.',
            history: ''
          }
        }
      }
    },
    [chapterId, userId, lastMsg]
  )

  const getAiResponse = useCallback(
    async (message: string, assetUrl?: string, threadId?: string) => {
      const response = await getRandomResponse(botType, message, assetUrl, threadId)
      console.log(response)
      return response
    },
    [botType, getRandomResponse]
  )

  const handleResponse = useCallback(
    async (result: any, threadId: string) => {
      if (result.success) {
        setMessages((prev) => prev.filter((msg) => !msg.loading))

        const assistantMessage: Message = {
          id: uuidv4(),
          content: result.data.answer,
          role: 'assistant',
          threadId,
          isTyping: true,
          assetUrl: result.botData?.assetUrl || undefined,
        }

        setMessages((prev) => [...prev, assistantMessage])
        setLastMsg(result.data.answer)

        console.log(result)

        if (userId) {
          await fetchAiTokenByUserId(userId)
        }
        const previousChatHistoryData: ChatItem = {
          id: result?.botData?.id,
          title: result?.botData?.title,
          userId: result?.botData?.userId,
          botType: result?.botData?.botType,
          threadId: result?.botData?.threadId,
          subjectId: result?.botData?.subjectId,
          chapterId: result?.botData?.chapterId,
          createdAt: new Date().toISOString()
        }

        dispatch(addChatHistoryItem(previousChatHistoryData))
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to get a response. Please try again.',
          variant: 'destructive'
        })
        setMessages((prev) => prev.filter((msg) => !msg.loading))
      }
    },
    [userId, fetchAiTokenByUserId]
  )

  const handleSendMessage = useCallback(
    async (content: string, assetUrl?: string, fileName?: string) => {
      console.log('handleSendMessage inputs:', { content, assetUrl, fileName })

      if (!content.trim() && !assetUrl) return

      try {
        let threadId = currentThreadId
        if (!threadId) {
          threadId = `${AI.THREAD_KEY}-${uuidv4().substring(0, 21)}`
          setCurrentThreadId(threadId)
          const pathname = window.location.pathname
          const basePathname = pathname
            .split('/')
            .filter((part) => !part.startsWith(AI.THREAD_KEY))
            .join('/')
          window.history.pushState({ input: content, assetFile: assetUrl || '' }, '', `${basePathname}/${threadId}`)
        }

        const userMessage: Message = {
          id: uuidv4(),
          content,
          role: 'user',
          assetUrl,
          threadId
        }
        setMessages((prev) => [...prev, userMessage])
        setLastMsg(content)

        setImageFile({})

        const loadingMessage: Message = {
          id: uuidv4(),
          content: '',
          role: 'assistant',
          isTyping: false,
          loading: true,
          threadId
        }
        setMessages((prev) => [...prev, loadingMessage])

        const result = await getAiResponse(content, assetUrl, threadId)
        console.log('bot res', result)

        handleResponse(result, threadId)

        if (result.success) {
          setTokenCount((prev) => Math.max(0, prev - 1))
        }
      } catch (error) {
        console.error('Error in send message flow:', error)
        toast({
          title: 'Error',
          description: 'Failed to get a response. Please try again.',
          variant: 'destructive'
        })
        setMessages((prev) => prev.filter((msg) => !msg.loading))
      }
    },
    [currentThreadId, createNewChat, getAiResponse, handleResponse]
  )

  const handleNewChat = useCallback(() => {
    if (messages.length === 0) return

    setIsLoading(false)
    setActiveMessageId(null)
    setLastMsg('')
    setImageFile({})
    setCurrentThreadId(null)

    if (welcomeMessage) {
      setMessages([
        {
          id: uuidv4(),
          content: welcomeMessage,
          role: 'assistant',
          threadId: undefined
        }
      ])
    } else {
      setMessages([])
    }

    setTokenCount(100)

    const pathname = window.location.pathname
    const basePathname = pathname
      .split('/')
      .filter((part) => !part.startsWith(AI.THREAD_KEY))
      .join('/')
    window.history.pushState({}, '', `${basePathname}`)
  }, [welcomeMessage, messages.length])

  const isChatLoading = useMemo(() => isLoading || activeMessageId !== null, [isLoading, activeMessageId])
  const chatTitle = title || 'AI Assistant'
  const chatPlaceholder = placeholder || 'Type your message here...'

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full">
      <div className="mx-auto flex w-full flex-col px-4 sm:w-[70%]">
        <Header title={chatTitle} onNewChat={handleNewChat} disableNewChat={messages.length === 0} subjectName={subjectName}/>

        <div className="relative mt-2 min-h-0 flex-1 overflow-hidden">
          <MessageList messages={messages} isLoading={isLoading} prompts={prompts || []} onSendMessage={handleSendMessage} />
        </div>

        <div className="flex-none py-4">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading}
            isCustomized={true}
            textAreaPlaceholder={chatPlaceholder}
          />
          <div className="mt-2 w-full">
            <p className="text-center text-sm text-gray-500">
              <span className="block text-xs">Our bots make mistakes. Double-check important details.</span>
              {AI.TOKEN_COUNT} <span className="font-semibold">{tokenDetails?.remainingTokens}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
