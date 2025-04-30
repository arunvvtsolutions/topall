'use client'
import Link from 'next/link'
import React, { useState } from 'react'

const FloatingAiBots = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="fixed bottom-6 right-6 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    //   onClick={(prev) => setIsHovered(!prev)}
    >
      {/* Main Floating Action Button (Always Visible) */}
      <button  className="
          w-14 h-14 rounded-full 
          bg-gradient-to-br 
            from-[#020817] 
            via-[#8a4bd1] 
            to-[#d34b4b] 
          shadow-deep
          flex items-center justify-center 
          text-white text-xl border
        ">
        🤖
      </button>
      {/* Secondary Buttons (Visible on Hover) */}
      <div 
        className={`w-[200px] space-y-3 absolute bottom-16 right-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      >
        <Link href="/chapter-wise-bot" className="bg-white border w-full text-gray-800 text-[14px] py-2 px-4 rounded-full shadow-md flex items-center space-x-2 hover:bg-gray-100">
          <span className="text-lg">🤖</span>
          <span>Weaker Areas Bots</span>
        </Link>
        <Link href="/doubt-ai" className="bg-white border w-full text-gray-800 text-[14px] py-2 px-4 rounded-full shadow-md flex items-center space-x-2 hover:bg-gray-100">
          <span className="text-lg">🤖</span>
          <span>Doubts AI</span>
        </Link>
        <Link href="/chapter-wise-bot/physics" className="bg-white border w-full text-gray-800 text-[14px] py-2 px-4 rounded-full shadow-md flex items-center space-x-2 hover:bg-gray-100">
          <span className="text-lg">🤖</span>
          <span>Chapter Wise Bots</span>
        </Link>
      </div>
    </div>
  )
}

export default FloatingAiBots