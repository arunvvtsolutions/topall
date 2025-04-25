'use client'

import React, { useState } from 'react'
import { Message } from './types'
import ChatMessage from './ChatMessage'
import LoadingIndicator from './LoadingIndicator'
import { useAutoScroll } from './useScrollToBottom'

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const { scrollRef, scrollToBottom, handleScroll: autoScrollHandler } = useAutoScroll([messages]);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Handle scroll events to show/hide scroll button
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    autoScrollHandler();
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
    setShowScrollButton(isScrolledUp);
  };

  return (
    <div className="relative h-full flex flex-col">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2"
        onScroll={handleScroll}
      >
        <div className="flex flex-col py-4 space-y-6">
          {messages.map(message => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              isTyping={message.isTyping}
            />
          ))}
          {isLoading && <LoadingIndicator />}
          {/* This div ensures we can scroll to the very bottom */}
          <div className="h-4" />
        </div>
      </div>
      
      {showScrollButton && (
        <button 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 z-10"
          onClick={() => scrollToBottom(true)}
          aria-label="Scroll to new messages"
        >
          <span className="text-sm font-medium">New messages</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </button>
      )}
    </div>
  )
}
