import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import {
  DataTable,
  DataTablePagination,
  DataTableSearch,
  PAGE_SIZES,
  useDataTable,
  type PageSize,
} from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  bankReviewsQueryOptions,
  pendingBankReviewsQueryOptions,
  type BankReviewStatus,
} from "../api/bank-reviews"
import { bankReviewColumns } from "../components/bank-review-columns"
import { ReviewSheet } from "../components/review-sheet"
import { useBankReviewFilters } from "../hooks/use-bank-review-filters"

const tabs: { value: BankReviewStatus; label: string }[] = [
  { value: "PENDING_REVIEW", label: "Pending" },
  { value: "VERIFIED", label: "Verified" },
  { value: "REJECTED", label: "Rejected" },
]

const emptyMessages: Record<BankReviewStatus, string> = {
  PENDING_REVIEW: "No bank accounts awaiting review",
  VERIFIED: "No verified bank accounts",
  REJECTED: "No rejected bank accounts",
}

export function BankReviewsPage() {
  const [filters, setFilters] = useBankReviewFilters()
  const { review: reviewId, ...listFilters } = filters
  const { data, isPending, isError, error, isPlaceholderData } = useQuery(
    bankReviewsQueryOptions(listFilters)
  )
  const { data: pending } = useQuery(pendingBankReviewsQueryOptions())

  const columns = useMemo(
    () => bankReviewColumns((r) => void setFilters({ review: r.id })),
    [setFilters]
  )
  const table = useDataTable({
    data: data?.items ?? [],
    columns,
    getRowId: (row) => row.id,
    pagination: {
      page: filters.page,
      pageSize: filters.pageSize,
      total: data?.total ?? 0,
      onChange: ({ page, pageSize }) =>
        void setFilters(
          pageSize !== filters.pageSize
            ? {
                pageSize: PAGE_SIZES.includes(pageSize as PageSize)
                  ? (pageSize as PageSize)
                  : null,
                page: null,
              }
            : { page }
        ),
    },
  })

  const selected = data?.items.find((r) => r.id === reviewId) ?? null

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <Tabs
          value={filters.status}
          onValueChange={(status: BankReviewStatus) =>
            void setFilters({ status, page: null, review: null })
          }
        >
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
                {tab.value === "PENDING_REVIEW" && !!pending?.pending && (
                  <Badge className="ml-1 h-5 min-w-5 px-1 tabular-nums">
                    {pending.pending}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <DataTableSearch
          value={filters.q}
          onChange={(q) =>
            void setFilters({ q, page: null }, { history: "replace" })
          }
          placeholder="Telegram ID, name or account number"
          label="Search bank accounts"
        />
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4">
          {isPending ? (
            <Skeleton className="h-96 w-full" />
          ) : isError ? (
            <p className="text-sm text-destructive">
              Couldn&apos;t load bank accounts: {error.message}
            </p>
          ) : (
            <>
              <DataTable
                table={table}
                dimmed={isPlaceholderData}
                emptyMessage={
                  filters.q
                    ? "No bank accounts match this search"
                    : emptyMessages[filters.status]
                }
              />
              <DataTablePagination table={table} />
            </>
          )}
        </CardContent>
      </Card>

      <ReviewSheet
        review={selected}
        onClose={() => void setFilters({ review: null })}
      />
    </div>
  )
}
