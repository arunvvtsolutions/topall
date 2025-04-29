'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { cn } from '@/lib/utils'
import { CrossIcon, ImageIcon, LoaderIcon, SendIcon } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
  isCustomized?: boolean
  textAreaPlaceholder?: string
}

export default function ChatInput({
  onSendMessage,
  isLoading,
  isCustomized = false,
  textAreaPlaceholder
}: ChatInputProps) {
  const [input, setInput] = useState('')
  const [imageFile, setImageFile] = useState<{ url: string; fileName: string }>({ url: '', fileName: '' })
  const fileRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // auto‐resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  // handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !imageFile.url) return

    onSendMessage(input.trim())
    setInput('')
    setImageFile({ url: '', fileName: '' })
  }

  // Enter sends
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  // open file picker
  const openFilePicker = () => fileRef.current?.click()

  // Axios‐based upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const { url } = response.data as { url: string }
      setImageFile({ url, fileName: file.name })
    } catch (err) {
      console.error('Upload error:', err)
      // you can toast or show an error here
    }
  }

  // clear chosen image
  const clearFile = () => {
    setImageFile({ url: '', fileName: '' })
    if (fileRef.current) fileRef.current.value = ''
  }

  // paste‐to‐preview fallback
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image')) {
        const file = items[i].getAsFile()
        if (file) {
          const url = URL.createObjectURL(file)
          setImageFile({ url, fileName: file.name || 'pasted.png' })
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
          onSubmit={handleSubmit}
          className={cn(
            "p-[6px] w-full border-t rounded-full border-[#F5F5F5] dark:border-[#fff] flex flex-col bg-[#fff] dark:bg-[#0a0a0a]",
            isCustomized && "dark:bg-[#171717] rounded-[50px]"
          )}
        >
          {!!imageFile.url && (
            <div className="px-6 py-2 relative max-w-fit">
              <button
                onClick={clearFile}
                type="button"
                className="absolute right-4 top-2 bg-white dark:bg-gray-700 rounded-full p-1"
              >
                <CrossIcon size={14} />
              </button>
              <Image
                src={imageFile.url}
                alt={imageFile.fileName}
                width={120}
                height={120}
                className="rounded-md"
              />
            </div>
          )}

          <div className="flex items-end px-2">
            <button
              type="button"
              onClick={openFilePicker}
              className="p-2 cursor-pointer"
            >
              <ImageIcon size={20} />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <textarea
              ref={textareaRef}
              onPaste={handlePaste}
              onKeyDown={handleKeyDown}
              placeholder={textAreaPlaceholder || "Type your message..."}
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 resize-none mx-2 p-2 rounded-2xl bg-transparent outline-none overflow-y-auto max-h-[150px]"
            />

            <button
              type="submit"
              disabled={isBtnDisabled || (!input.trim() && !imageFile.url)}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-black text-white disabled:opacity-50"
            >
              {isBtnDisabled ? <LoaderIcon size={18} className="animate-spin" /> : <SendIcon size={18} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
