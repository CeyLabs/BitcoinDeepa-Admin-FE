import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { transactionsQueryOptions } from "../api/transactions"
import { TransactionsFilters } from "../components/transactions-filters"
import { TransactionsPagination } from "../components/transactions-pagination"
import { TransactionsTable } from "../components/transactions-table"
import { useTransactionFilters } from "../hooks/use-transaction-filters"

export function TransactionsPage() {
  const [filters, setFilters] = useTransactionFilters()
  const { data, isPending, isError, error, isPlaceholderData } = useQuery(
    transactionsQueryOptions(filters)
  )

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
              {data.items.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-sm text-muted-foreground">
                  {data.total > 0 ? (
                    <>
                      This page is empty.
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void setFilters({ page: null })}
                      >
                        Go to first page
                      </Button>
                    </>
                  ) : (
                    "No transactions match these filters"
                  )}
                </div>
              ) : (
                <div
                  className={
                    isPlaceholderData ? "opacity-60 transition-opacity" : ""
                  }
                >
                  <TransactionsTable transactions={data.items} showPaymentId />
                </div>
              )}
              <TransactionsPagination
                page={filters.page}
                pageSize={filters.pageSize}
                pageCount={data.pageCount}
                total={data.total}
                onPageChange={(page) => void setFilters({ page })}
                onPageSizeChange={(pageSize) =>
                  void setFilters({ pageSize, page: null })
                }
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
