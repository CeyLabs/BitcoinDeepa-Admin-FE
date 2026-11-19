import { XIcon } from "lucide-react"

import { DataTableSearch } from "@/components/data-table"

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
  type TransactionKind,
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

const kindItems: Record<string, string> = {
  [ALL]: "All types",
  RECURRING: "Plan charges",
  ONE_TIME: "One-time buys",
}

export function TransactionsFilters() {
  const [filters, setFilters] = useTransactionFilters()

  const hasFilters = Boolean(
    filters.status || filters.kind || filters.from || filters.to || filters.q
  )

  return (
    <div className="flex flex-wrap items-end gap-2">
      <DataTableSearch
        value={filters.q}
        onChange={(q) =>
          void setFilters({ q, page: null }, { history: "replace" })
        }
        placeholder="Payment ID, member ID or name"
        label="Search transactions"
      />
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
      <Select
        items={kindItems}
        value={filters.kind ?? ALL}
        onValueChange={(value) =>
          void setFilters({
            kind: value === ALL ? null : (value as TransactionKind),
            page: null,
          })
        }
      >
        <SelectTrigger className="w-40" aria-label="Type">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(kindItems).map(([value, label]) => (
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
              kind: null,
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
