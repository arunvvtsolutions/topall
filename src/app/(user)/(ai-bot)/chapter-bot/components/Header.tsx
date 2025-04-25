'use client'

import React from 'react'

interface HeaderProps {
  title?: string
  onNewChat?: () => void
}

export default function Header({ title = 'AI Assistant', onNewChat }: HeaderProps) {
  return (
    <header className=" sticky top-0 z-10 flex items-center justify-between border-b sm:py-[34px] py-[24px]">
      <div className="flex items-center space-x-3">
        <h1 className="sm:text-xl text-[17px] font-semibold text-gray-800">{title}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onNewChat}
          className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-50"
        >
          New Chat
        </button>
      </div>
    </header>
  )
}
