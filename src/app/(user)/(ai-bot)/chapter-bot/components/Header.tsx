'use client';

import { Button } from '@/components/ui/button';
import { EditIcon } from 'lucide-react';
import React from 'react';

interface HeaderProps {
  title?: string;
  onNewChat?: () => void;
  disableNewChat?: boolean;
  subjectName?: string;
}

export default function Header({ title = 'AI Assistant', onNewChat, disableNewChat = false, subjectName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b py-[24px] sm:pb-[10px] sm:pt-[24px]">
      <div className="flex flex-col items-start gap-[1px]">
        <h1 className="text-[17px] font-semibold text-gray-800 sm:text-xl pb-[2px]">{title}</h1>
        <p className="text-[12px] text-[#101010c8]">{subjectName}</p>
        <p className="text-[12px] text-[#101010c8]">1 credit per text, 5 credits per image.</p>
      </div>
      <div className="flex items-center space-x-2 px-4">
        <Button
          onClick={onNewChat}
          variant="active_outline"
          disabled={disableNewChat}
          className={`flex rounded-md border border-gray-300 px-2 py-2 align-middle text-sm transition-colors ${disableNewChat ? 'cursor-not-allowed bg-gray-100 text-gray-400' : ''}`}
        >
          <EditIcon className="mb- mr-2 w-4" /> <span className="mt-0.5"> Start New Chat</span>
        </Button>
      </div>
    </header>
  );
}
