"use client"

import React, { useState } from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type DropdownOption = {
  id: number
  name: string
}

type ReusableDropdownProps = {
  options: DropdownOption[]
  value?: number // Selected id
  onChange: (selectedOption: DropdownOption) => void
  floatingLabel?: string // Floating label text
  borderColor?: string // CSS class for border and label text color
}

export const ReusableDropdown: React.FC<ReusableDropdownProps> = ({
  options,
  value,
  onChange,
  floatingLabel,
  borderColor = "border-gray-300 text-gray-500",
}) => {
  const [selectedId, setSelectedId] = useState<number | undefined>(value)

  const handleSelect = (id: number) => {
    const selectedOption = options.find((option) => option.id === id)
    if (selectedOption) {
      setSelectedId(id)
      onChange(selectedOption)
    }
  }

  const selectedOption = options.find((option) => option.id === selectedId)

  return (
    <div className="relative">
      {floatingLabel && (
        <label
          className={cn(
            `absolute -top-2.5 left-2 text-xs bg-white px-1`,
            borderColor
          )}
        >
          {floatingLabel}
        </label>
      )}
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger asChild>
          <button
            className={cn(
              `flex justify-between items-center w-full px-4 py-2 border rounded-md text-sm bg-white`,
              borderColor
            )}
          >
            {selectedOption?.name || "Select"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>
        </DropdownMenuPrimitive.Trigger>
        <DropdownMenuPrimitive.Content
          className="z-50 mt-2 w-full min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-md"
        >
          {options.map((option) => (
            <DropdownMenuPrimitive.Item
              key={option.id}
              className="cursor-pointer px-2 py-1.5 text-sm hover:bg-gray-100"
              onClick={() => handleSelect(option.id)}
            >
              {option.name}
            </DropdownMenuPrimitive.Item>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Root>
    </div>
  )
}
