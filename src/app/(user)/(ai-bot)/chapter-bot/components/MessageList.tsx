'use client';

import React, { useState } from 'react';
import { Message } from './types';
import ChatMessage from './ChatMessage';
import LoadingIndicator from './LoadingIndicator';
import { useAutoScroll } from './useScrollToBottom';
import CardGrid from '../../doubt-ai/components/ai-prompt-card';
<<<<<<< HEAD
=======
import { ArrowDown } from 'lucide-react';
>>>>>>> cfab089 (changes in ui dev + arun)

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

<<<<<<< HEAD
export default function MessageList({ messages, isLoading, prompts ,onSendMessage}: MessageListProps) {
  const { scrollRef, scrollToBottom, handleScroll: autoScrollHandler } = useAutoScroll([messages]);
  const [showScrollButton, setShowScrollButton] = useState(false);

=======
export default function MessageList({ messages, isLoading, prompts, onSendMessage}: MessageListProps) {
  const { scrollRef, scrollToBottom, handleScroll: autoScrollHandler } = useAutoScroll([messages]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
>>>>>>> cfab089 (changes in ui dev + arun)
  // Handle scroll events to show/hide scroll button
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    autoScrollHandler();
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
    setShowScrollButton(isScrolledUp);
  };

  return (
<<<<<<< HEAD
    <div className="relative flex h-full flex-col">
      <div
        ref={scrollRef}
        className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-1 overflow-y-auto pr-2"
        onScroll={handleScroll}
      >
        <div className="flex flex-col space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-24">
              <div className="flex flex-col items-center space-y-6">
                <div className="text-xl font-semibold">Hello, How can I help you today</div>
=======
    <div className="relative flex flex-col h-full w-full">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        onScroll={handleScroll}
      >
        <div className="flex flex-col space-y-4 w-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-24 w-full">
              <div className="flex flex-col items-center space-y-6 w-full max-w-4xl mx-auto px-4">
                <div className="text-xl font-semibold text-center">
                  Hello, How can I help you today
                </div>
>>>>>>> cfab089 (changes in ui dev + arun)
                <CardGrid cards={prompts} onSendMessage={onSendMessage} />
              </div>
            </div>
          ) : (
<<<<<<< HEAD
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} isTyping={message.isTyping} />
              ))}
            </>
=======
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} isTyping={message.isTyping} />
            ))
>>>>>>> cfab089 (changes in ui dev + arun)
          )}
          {isLoading && <LoadingIndicator />}
          <div className="h-4" />
        </div>
      </div>

      {showScrollButton && (
        <button
<<<<<<< HEAD
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 transform items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white shadow-lg transition-all hover:bg-blue-700"
          onClick={() => scrollToBottom(true)}
          aria-label="Scroll to new messages"
        >
          <span className="text-sm font-medium">New messages</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
=======
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 transform items-center gap-2 rounded-full px-3 py-2 bg-white/90 text-gray-700 shadow-lg hover:bg-white transition-all border border-gray-200"
          onClick={() => scrollToBottom(true)}
          aria-label="Scroll to new messages"
        >
          <ArrowDown className="w-4 h-4" />
          {/* <span className="text-sm">New messages</span> */}
>>>>>>> cfab089 (changes in ui dev + arun)
        </button>
      )}
    </div>
  );
}
