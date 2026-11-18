import { useEffect, useRef, useState } from "react"
import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"

/**
 * Search box that reports its value 300ms after typing stops. `value` is the
 * applied search (e.g. from the URL); the box follows it when it changes
 * elsewhere (Back button, "Clear").
 */
export function DataTableSearch({
  value,
  onChange,
  placeholder,
  label = "Search",
}: {
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  label?: string
}) {
  const [text, setText] = useState(value ?? "")
  const [synced, setSynced] = useState(value)
  if (value !== synced) {
    setSynced(value)
    setText(value ?? "")
  }

  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  // The applied search changed (Clear, Back, or our own update): drop any
  // pending search so stale text isn't applied over it
  useEffect(() => clearTimeout(timer.current), [value])
  // Don't apply a pending search after leaving the page
  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <div className="relative w-full sm:w-64">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={text}
        onChange={(e) => {
          const next = e.target.value
          setText(next)
          clearTimeout(timer.current)
          timer.current = setTimeout(() => onChange(next.trim() || null), 300)
        }}
        placeholder={placeholder}
        aria-label={label}
        className="pl-8"
      />
    </div>
  )
}
