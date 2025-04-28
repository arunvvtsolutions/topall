'use client'

import React, { useState, useEffect } from 'react'
import { Message } from './types'
import MarkdownForBot from './ReactMarkDown'

interface ChatMessageProps {
  message: Message
  isTyping?: boolean
}

export default function ChatMessage({ message, isTyping = false }: ChatMessageProps) {
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
      }, 15) // Speed of typing animation
      
      // Force a scroll update after each character is added
      document.dispatchEvent(new CustomEvent('scrollToBottom'))
      
      return () => clearInterval(interval)
    } else {
      setDisplayedContent(message.content)
      setIsComplete(true)
    }
  }, [message.content, isUser, isTyping])

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${isUser ? 'bg-[#f8f8f8] ' : 'bg-white '}`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{displayedContent}</p>
        ) : (
          <MarkdownForBot content={displayedContent} />
        )}
        {!isComplete && (
          <span className="inline-block animate-pulse ml-1">▋</span>
        )}
      </div>
    </div>
  )
}
