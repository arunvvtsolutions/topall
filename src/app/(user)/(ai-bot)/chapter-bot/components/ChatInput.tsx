'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
  isCustomized?: boolean
  textAreaPlaceholder?: string
}

// Icons for the chat input
const AttachIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.33 3.18C13.0806 2.42943 14.0991 2.00017 15.16 2.00017C16.2209 2.00017 17.2394 2.42943 17.99 3.18C18.7406 3.93057 19.1699 4.94912 19.1699 6.01C19.1699 7.07088 18.7406 8.08943 17.99 8.84L9.41 17.41C9.03472 17.7853 8.52573 17.9961 7.995 17.9961C7.46427 17.9961 6.95528 17.7853 6.58 17.41C6.20472 17.0347 5.99389 16.5257 5.99389 15.995C5.99389 15.4643 6.20472 14.9553 6.58 14.58L15.07 6.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SendPlane = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.3333 1.66667L9.16667 10.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.3333 1.66667L12.5 18.3333L9.16667 10.8333L1.66667 7.5L18.3333 1.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const Cross2Icon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
  </svg>
)

const LoadingSpinner = () => (
  <div className="animate-spin h-5 w-5">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>
)

export default function ChatInput({ onSendMessage, isLoading, isCustomized = false, textAreaPlaceholder }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [imageFile, setImageFile] = useState<{ url: string; fileName: string }>({ url: '', fileName: '' })
  const fileRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Auto-adjust height on initial render
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !imageFile.url) return
    
    // Here you would typically handle both text and image
    // For now, we'll just handle the text part
    onSendMessage(input.trim())
    setInput('')
    setImageFile({ url: '', fileName: '' })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  const handleFileOpen = () => {
    fileRef.current?.click()
  }

  const handleFileOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImageFile({ url, fileName: file.name })
    }
  }

  const onFileClear = () => {
    setImageFile({ url: '', fileName: '' })
    if (fileRef.current) {
      fileRef.current.value = ''
    }
  }

  const onPasteImage = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile()
        if (file) {
          const url = URL.createObjectURL(file)
          setImageFile({ url, fileName: file.name || 'pasted-image.png' })
        }
      }
    }
  }

  const isBtnDisabled = isLoading

  return (
    <div className="p-4">
      <div
        style={{
          borderRadius: "50px",
          background: "white",
          border: "3px solid transparent",
          backgroundImage:
            "linear-gradient(white, white), linear-gradient(90deg, #eb504f, #4285f4, #8a4bd1, #c04c8a, #eb504f)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        <form
          className={cn(
            "p-[6px] w-full border-t rounded-full border-[#F5F5F5] dark:border-[#fff] flex flex-col bg-[#fff] dark:bg-[#0a0a0a]",
            isCustomized && "dark:bg-[#171717] rounded-[50px]"
          )}
          onSubmit={handleSubmit}
        >
          {imageFile?.url && (
            <div className="px-6 py-2 transition-all relative max-w-fit">
              {imageFile?.fileName?.split(".")[1] === "pdf" ? (
                <>
                  <button
                    className="absolute right-5 top-1 border-none p-[1px] cursor-pointer rounded-full bg-[#FFF] dark:bg-[#cbcbcb]"
                    onClick={onFileClear}
                  >
                    <Cross2Icon />
                  </button>
                  <div className="rounded-md transition-all bg-[#e6e6e6] dark:bg-[#171717] px-4 py-2">
                    {imageFile.fileName}
                  </div>
                </>
              ) : (
                <>
                  <button
                    className="absolute right-7 top-3 border-none p-[1px] cursor-pointer rounded-full bg-[#cbcbcb]"
                    onClick={onFileClear}
                  >
                    <Cross2Icon />
                  </button>
                  <Image
                    src={imageFile.url}
                    loading="lazy"
                    alt={`${imageFile.fileName}`}
                    width={120}
                    height={250}
                    className="h-20 rounded-md transition-all"
                  />
                </>
              )}
            </div>
          )}
          <div className={cn("flex w-full items-end px-2", isCustomized && "pr-0")}>
            <button
              onClick={handleFileOpen}
              type="button"
              className="bg-none border-none cursor-pointer m-auto p-2"
            >
              <AttachIcon />
            </button>
            <input type="file" name="" id="" hidden ref={fileRef} onChange={handleFileOnchange} />
            <textarea
              onPaste={onPasteImage}
              autoFocus
              placeholder={textAreaPlaceholder || "Ask about concepts, solve problems, or request explanations..."}
              className={cn(
                "w-full p-2 placeholder-[#000] dark:placeholder-[#fff] rounded-2xl border-none outline-none bg-transparent flex-1 focus-visible:outline-none text-[14px] resize-none min-h-[40px] max-h-[150px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent overflow-y-auto overflow-x-hidden [&::placeholder]:truncate [&::placeholder]:whitespace-nowrap",
                isCustomized && "h-auto"
              )}
              value={input}
              ref={textareaRef}
              onKeyPress={handleKeyPress}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-grow textarea up to 120px, then scroll
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              rows={1}
              disabled={isLoading}
            />
            <button
              disabled={isBtnDisabled || (!input.trim() && !imageFile.url)}
              type="submit"
              className={cn(
                "bg-[#000] !text-[20px] dark:bg-[#CCE6FC] text-[#FFFFFF] dark:text-[#021863] w-9 h-9 cursor-pointer flex-shrink-0 rounded-full flex justify-center items-center ml-2",
                isCustomized && "bg-[#000] my-auto rounded-[50px] mr-0 flex-shrink-0"
              )}
            >
              {isBtnDisabled ? <LoadingSpinner /> : <SendPlane />}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
