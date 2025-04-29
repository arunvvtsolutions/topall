'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Message } from './types'
import MarkdownForBot from './ReactMarkDown'
import { cn } from '@/lib/utils'

const DEFAULT_TYPING_SPEED = 10 // Balanced speed for typing

interface ChatMessageProps {
  message: Message
  isTyping?: boolean
  typingSpeed?: number
}

export default function ChatMessage({
  message,
  isTyping = false,
  typingSpeed = DEFAULT_TYPING_SPEED,
}: ChatMessageProps) {
  const isUser = message.role === 'user'
  const [displayedContent, setDisplayedContent] = useState('')
  const [isComplete, setIsComplete] = useState(isUser)
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    if (isUser) {
      setDisplayedContent(message.content)
      setIsComplete(true)
      return
    }

    if (isTyping && typeof window !== 'undefined') {
      try {
        workerRef.current = new Worker(new URL('../workers/typingWorker.ts', import.meta.url))

        workerRef.current.onmessage = (e: MessageEvent) => {
          const { type, content } = e.data
          if (type === 'UPDATE') {
            setDisplayedContent((prev) => prev + content)
            requestAnimationFrame(() => {
              document.dispatchEvent(new CustomEvent('scrollToBottom'))
            })
          } else if (type === 'COMPLETE') {
            setIsComplete(true)
          }
        }

        workerRef.current.postMessage({
          content: message.content,
          typingSpeed,
        })

        return () => {
          if (workerRef.current) {
            workerRef.current.terminate()
            workerRef.current = null
          }
        }
      } catch (error) {
        console.error('Web Worker error:', error)
        setDisplayedContent(message.content)
        setIsComplete(true)
      }
    } else {
      setDisplayedContent(message.content)
      setIsComplete(true)
    }
  }, [message.content, isUser, isTyping, typingSpeed])

  return (
    <div className={`w-full px-4 py-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={cn(isUser ? 'w-[80%] flex justify-end' : '' ,` rounded-lg px-4 py-2 ${
          isUser ? '' : ' text-gray-900 rounded-bl-none'
        }`)}
      >
        {isUser ? (
          <p className="w-fit p-3 rounded-lg bg-[#f5f5f5] text-[15px] rounded-br-none whitespace-pre-wrap break-words">{displayedContent}</p>
        ) : (
          <MarkdownForBot content={displayedContent} />
        )}
        {/* {!isComplete && (
          <div className="flex items-center mt-1 space-x-1">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="inline-block bg-gray-400 rounded-full w-1.5 h-1.5 animate-pulse"
                style={{ animationDelay: `${dot * 200}ms` }}
              />
            ))}
          </div>
        )} */}
      </div>
    </div>
  )
}
