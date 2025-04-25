'use client'

import { Button } from '@/components/ui/button'
import { EditIcon } from 'lucide-react'
import React from 'react'

interface HeaderProps {
  title?: string
  onNewChat?: () => void
  disableNewChat?: boolean
}

export default function Header({ title = 'AI Assistant', onNewChat, disableNewChat = false }: HeaderProps) {
  return (
    <header className=" sticky top-0 z-10 flex items-center justify-between border-b sm:py-[34px] py-[24px]">
      <div className="flex items-center space-x-3">
        <h1 className="sm:text-xl text-[17px] font-semibold text-gray-800">{title}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={onNewChat}
          variant='active_outline'
          disabled={disableNewChat}
          className={`flex align-middle rounded-md border border-gray-300 px-2 py-2 text-sm transition-colors ${disableNewChat ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
        >
         <EditIcon className='w-4 mr-2 mb-' /> <span className='mt-0.5'> Start New Chat</span>
        </Button>
      </div>
    </header>
  )
}
