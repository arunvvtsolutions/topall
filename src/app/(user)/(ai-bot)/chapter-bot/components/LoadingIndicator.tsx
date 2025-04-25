'use client'

import React from 'react'

export default function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-lg bg-white p-4 shadow-md">
        <div className="flex space-x-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.2s' }}></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}
