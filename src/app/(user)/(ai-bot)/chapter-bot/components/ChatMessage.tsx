'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Message } from './types';
import MarkdownForBot from './ReactMarkDown';
import { cn } from '@/lib/utils';

const DEFAULT_TYPING_SPEED = 10; // Balanced speed for typing

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
  typingSpeed?: number;
}

export default function ChatMessage({ message, isTyping = false, typingSpeed = DEFAULT_TYPING_SPEED }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [displayedContent, setDisplayedContent] = useState('');
  const [isComplete, setIsComplete] = useState(isUser);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (isUser) {
      setDisplayedContent(message.content);
      setIsComplete(true);
      return;
    }

    if (isTyping && typeof window !== 'undefined') {
      try {
        workerRef.current = new Worker(new URL('../workers/typingWorker.ts', import.meta.url));

        workerRef.current.onmessage = (e: MessageEvent) => {
          const { type, content } = e.data;
          if (type === 'UPDATE') {
            setDisplayedContent((prev) => prev + content);
            requestAnimationFrame(() => {
              document.dispatchEvent(new CustomEvent('scrollToBottom'));
            });
          } else if (type === 'COMPLETE') {
            setIsComplete(true);
          }
        };

        workerRef.current.postMessage({
          content: message.content,
          typingSpeed
        });

        return () => {
          if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
          }
        };
      } catch (error) {
        console.error('Web Worker error:', error);
        setDisplayedContent(message.content);
        setIsComplete(true);
      }
    } else {
      setDisplayedContent(message.content);
      setIsComplete(true);
    }
  }, [message.content, isUser, isTyping, typingSpeed]);

  console.log(message);
  
  return (
    <div className={`flex w-full px-4 py-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={cn(
          isUser ? 'flex w-[80%] justify-end' : '',
          `rounded-lg px-4 py-2 ${isUser ? '' : 'rounded-bl-none text-gray-900'}`
        )}
      >
        <div className="flex flex-col gap-2">
        {isUser && message.assetUrl && (
          <div className="relative mb-2">
            <Image
            
              src={message.assetUrl}
              alt={message.fileName || 'User upload'}
              width={200}
              height={200}
              className="object-contain  w-[200px] h-[200px] p-2 border rounded-lg"
              loading="lazy"
              unoptimized
            />
          </div>
        )}

        {/* BOT IMAGE */}
        {/* {!isUser && message.assetUrl && (
          <div className="relative mb-2">
            <Image
              src={message.assetUrl}
              alt={message.fileName || 'Bot upload'}
              width={200}
              height={200}
              className="rounded-md object-contain"
              loading="lazy"
              unoptimized
            />
          </div>
        )} */}
          {displayedContent &&
            (isUser ? (
              <p className="w-fit whitespace-pre-wrap break-words rounded-lg rounded-br-none bg-[#f5f5f5] p-3 text-[15px]">
                {displayedContent}
              </p>
            ) : (
              <MarkdownForBot content={displayedContent} />
            ))}
        </div>
      </div>
    </div>
  );
}
