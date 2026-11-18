import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatNumber } from "@/lib/format"

import { PAGE_SIZES, type PageSize } from "../api/transactions"

export function TransactionsPagination({
  page,
  pageSize,
  pageCount,
  total,
  onPageChange,
  onPageSizeChange,
}: {
  page: number
  pageSize: PageSize
  pageCount: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: PageSize) => void
}) {
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)
  const sizeItems = Object.fromEntries(
    PAGE_SIZES.map((size) => [String(size), `${size} / page`])
  )

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
      <span className="text-muted-foreground">
        {total === 0
          ? "No results"
          : `Showing ${formatNumber(first)}–${formatNumber(last)} of ${formatNumber(total)}`}
      </span>
      <div className="flex items-center gap-2">
        <Select
          items={sizeItems}
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value) as PageSize)}
        >
          <SelectTrigger size="sm" className="w-32" aria-label="Rows per page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZES.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="tabular-nums">
          Page {formatNumber(page)} of {formatNumber(pageCount)}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  )
}
