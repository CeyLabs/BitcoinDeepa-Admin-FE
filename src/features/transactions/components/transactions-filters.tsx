import { useEffect, useRef, useState } from "react"
import { SearchIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  TRANSACTION_STATUSES,
  type TransactionStatus,
} from "../api/transactions"
import { useTransactionFilters } from "../hooks/use-transaction-filters"

const ALL = "all"
const statusItems: Record<string, string> = {
  [ALL]: "All statuses",
  ...Object.fromEntries(
    TRANSACTION_STATUSES.map((s) => [s, s.charAt(0) + s.slice(1).toLowerCase()])
  ),
}

export function TransactionsFilters() {
  const [filters, setFilters] = useTransactionFilters()

  // Search box: type freely, update the URL (and refetch) 300ms after typing stops
  const [search, setSearch] = useState(filters.q ?? "")
  const [syncedQ, setSyncedQ] = useState(filters.q)
  if (filters.q !== syncedQ) {
    // URL changed elsewhere (back button, "Clear")
    setSyncedQ(filters.q)
    setSearch(filters.q ?? "")
  }
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  // Don't apply a pending search after leaving the page
  useEffect(() => () => clearTimeout(timer.current), [])
  function onSearch(value: string) {
    setSearch(value)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      void setFilters({ q: value.trim() || null, page: null })
    }, 300)
  }

  const hasFilters = Boolean(
    filters.status || filters.from || filters.to || filters.q
  )

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="relative w-full sm:w-64">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Payment ID, member ID or name"
          aria-label="Search transactions"
          className="pl-8"
        />
      </div>
      <Select
        items={statusItems}
        value={filters.status ?? ALL}
        onValueChange={(value) =>
          void setFilters({
            status: value === ALL ? null : (value as TransactionStatus),
            page: null,
          })
        }
      >
        <SelectTrigger className="w-40" aria-label="Status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(statusItems).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        From
        <Input
          type="date"
          value={filters.from ?? ""}
          max={filters.to ?? undefined}
          onChange={(e) =>
            void setFilters({ from: e.target.value || null, page: null })
          }
          className="w-40"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        To
        <Input
          type="date"
          value={filters.to ?? ""}
          min={filters.from ?? undefined}
          onChange={(e) =>
            void setFilters({ to: e.target.value || null, page: null })
          }
          className="w-40"
        />
      </label>
      {hasFilters && (
        <Button
          variant="ghost"
          onClick={() =>
            void setFilters({
              status: null,
              from: null,
              to: null,
              q: null,
              page: null,
            })
          }
        >
          <XIcon />
          Clear
        </Button>
      )}
    </div>
  )
}
