'use client'

import React, { useState, useEffect } from 'react'
import { Message } from './types'
import MarkdownForBot from './ReactMarkDown'

const DEFAULT_TYPING_SPEED = 5 // ms; lower value = faster typing

interface ChatMessageProps {
  message: Message
  isTyping?: boolean
  typingSpeed?: number
}

export default function ChatMessage({ message, isTyping = false, typingSpeed = DEFAULT_TYPING_SPEED }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const [displayedContent, setDisplayedContent] = useState('')
  const [isComplete, setIsComplete] = useState(isUser) // User messages don't animate
  
  useEffect(() => {
    if (isUser) {
      setDisplayedContent(message.content)
      setIsComplete(true)
      return
    }
    
    if (isTyping) {
      let index = 0
      const interval = setInterval(() => {
        if (index < message.content.length) {
          setDisplayedContent(prev => prev + message.content.charAt(index))
          index++
        } else {
          clearInterval(interval)
          setIsComplete(true)
        }
      }, typingSpeed) // Speed of typing animation
      
      // Force a scroll update after each character is added
      document.dispatchEvent(new CustomEvent('scrollToBottom'))
      
      return () => clearInterval(interval)
    } else {
      setDisplayedContent(message.content)
      setIsComplete(true)
    }
  }, [message.content, isUser, isTyping, typingSpeed])

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${isUser ? 'bg-[#ebebeb] ' : ' '}`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{displayedContent}</p>
        ) : (
          <MarkdownForBot content={displayedContent} />
        )}
        {/* {!isComplete && (
          <div className="flex items-center ml-1 space-x-1">
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
