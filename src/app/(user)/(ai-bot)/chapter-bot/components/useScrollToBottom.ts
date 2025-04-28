'use client';

import { useEffect, useRef } from 'react';

/**
 * Custom hook to manage automatic scrolling to bottom for chat interfaces
 * @param dependencies - Array of dependencies that should trigger a scroll to bottom when changed
 */
export const useAutoScroll = (dependencies: any[] = []) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);

  const scrollToBottom = (force = false) => {
    if (scrollRef.current) {
      // Always scroll if force is true, otherwise only if user hasn't scrolled up
      if (force || !userScrolledRef.current) {
        // Use smooth scrolling for better UX
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth'
        });
        
        // Reset the user scrolled flag when we force a scroll
        if (force) {
          userScrolledRef.current = false;
        }
      }
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // If we're at the bottom, reset the userScrolled flag
    if (scrollHeight - scrollTop - clientHeight < 10) {
      userScrolledRef.current = false;
    } else {
      userScrolledRef.current = true;
    }
  };

  // Scroll to bottom when dependencies change, but respect user scrolling
  useEffect(() => {
    // Only auto-scroll for new messages if the user hasn't manually scrolled up
    if (dependencies.length > 0) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [...dependencies]);

  // Listen for custom scroll events
  useEffect(() => {
    const handleCustomScroll = () => scrollToBottom(true);
    document.addEventListener('scrollToBottom', handleCustomScroll);
    
    return () => {
      document.removeEventListener('scrollToBottom', handleCustomScroll);
    };
  }, []);

  return { scrollRef, scrollToBottom, handleScroll, userScrolledRef };
};
