"use client"

import * as React from "react"
import { Search } from "lucide-react"

type SearchBarProps = {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export default function SearchBar({ placeholder = "Search", value, onChange }: SearchBarProps) {
  // Support both controlled and uncontrolled usage
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState("")

  const currentValue = isControlled ? value! : internalValue

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(e.target.value)
    if (!isControlled) setInternalValue(e.target.value)
  }

  return (
    <label
      role="search"
      aria-label="Search"
      className="flex items-center gap-3 rounded-full bg-[#202c33] px-4 py-3 text-gray-400 focus-within:ring-2 focus-within:ring-[#00a884] transition-all"
    >
      <Search className="size-5 shrink-0" aria-hidden="true" />
      <input
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 h-5 border-0 bg-transparent p-0 text-sm leading-5 text-white placeholder:text-gray-400 outline-none focus:outline-none"
        aria-label={placeholder}
      />
    </label>
  )
}
