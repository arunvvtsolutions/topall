'use client';

import React, { useState } from 'react';
import { Message } from './types';
import ChatMessage from './ChatMessage';
import LoadingIndicator from './LoadingIndicator';
import { useAutoScroll } from './useScrollToBottom';
import CardGrid from '../../doubt-ai/components/ai-prompt-card';
import { ArrowDown, ArrowDownAZ } from 'lucide-react';

interface PromptCard {
  id: number;
  title: string;
  prompt: string;
  onSendMessage: (message: string) => void
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  prompts: PromptCard[]; 
  onSendMessage: (message: string) => void
}

export default function MessageList({ messages, isLoading, prompts ,onSendMessage}: MessageListProps) {
  const { scrollRef, scrollToBottom, handleScroll: autoScrollHandler } = useAutoScroll([messages]);
  const [showScrollButton, setShowScrollButton] = useState(false);

  console.log("messages",messages);
  
  // Handle scroll events to show/hide scroll button
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    autoScrollHandler();
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
    setShowScrollButton(isScrolledUp);
  };
  // relative flex h-full flex-col
  return (
    <div className="relative flex flex-col h-full"> {/* ✅ Important: relative, flex-col, h-full */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2"
        onScroll={handleScroll}
      >
        <div className="flex flex-col space-y-6 p-2">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-24">
              <div className="flex flex-col items-center space-y-6">
                <div className="text-xl font-semibold">
                  Hello, How can I help you today
                </div>
                <CardGrid cards={prompts} onSendMessage={onSendMessage} />
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} isTyping={message.isTyping} />
            ))
          )}
          {isLoading && <LoadingIndicator />}
          <div className="h-4" />
        </div>
      </div>

      {showScrollButton && (
        <button
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 transform items-center gap-2 rounded-full px-2 border bg-[#dbdbdb] py-1 text-black shadow-2xl transition-all"
          onClick={() => scrollToBottom(true)}
          aria-label="Scroll to new messages"
        >
          <ArrowDown className="text-[#535353] w-5" />
        </button>
      )}
    </div>
  );
}
