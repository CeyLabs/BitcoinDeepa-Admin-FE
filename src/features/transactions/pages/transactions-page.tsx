import { useQuery } from "@tanstack/react-query"

import {
  DataTable,
  DataTablePagination,
  PAGE_SIZES,
  useDataTable,
  type PageSize,
} from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { transactionsQueryOptions } from "../api/transactions"
import { transactionColumns } from "../components/transactions-columns"
import { TransactionsFilters } from "../components/transactions-filters"
import { useTransactionFilters } from "../hooks/use-transaction-filters"

export function TransactionsPage() {
  const [filters, setFilters] = useTransactionFilters()
  const { data, isPending, isError, error, isPlaceholderData } = useQuery(
    transactionsQueryOptions(filters)
  )

  const table = useDataTable({
    data: data?.items ?? [],
    columns: transactionColumns,
    getRowId: (tx) => tx.id,
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

  const pastLastPage = data && data.items.length === 0 && data.total > 0

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <TransactionsFilters />
      <Card>
        <CardContent className="flex flex-col gap-4">
          {isPending ? (
            <Skeleton className="h-96 w-full" />
          ) : isError ? (
            <p className="text-sm text-destructive">
              Couldn&apos;t load transactions: {error.message}
            </p>
          ) : (
            <>
              <DataTable
                table={table}
                dimmed={isPlaceholderData}
                emptyMessage={
                  pastLastPage ? (
                    <div className="flex flex-col items-center gap-2">
                      This page is empty.
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void setFilters({ page: null })}
                      >
                        Go to first page
                      </Button>
                    </div>
                  ) : (
                    "No transactions match these filters"
                  )
                }
              />
              <DataTablePagination table={table} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
