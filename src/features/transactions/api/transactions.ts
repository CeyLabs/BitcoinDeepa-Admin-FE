import { keepPreviousData, queryOptions } from "@tanstack/react-query"

import type { PageSize } from "@/components/data-table"
import { apiFetch } from "@/lib/api"

export const TRANSACTION_STATUSES = [
  "SUCCESS",
  "PENDING",
  "CANCELLED",
  "FAILED",
  "CHARGEBACK",
] as const
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number]

export interface Transaction {
  id: string
  createdAt: string
  status: TransactionStatus
  settled: boolean
  grossLkr: number | null
  netLkr: number | null
  satoshis: number | null
  user: { id: string; name: string } | null
  packageName: string | null
}

export interface TransactionPage {
  items: Transaction[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}

export interface TransactionFilters {
  page?: number
  pageSize?: PageSize
  status?: TransactionStatus | null
  /** YYYY-MM-DD, Sri Lanka time, inclusive */
  from?: string | null
  to?: string | null
  q?: string | null
}

export const transactionsQueryOptions = (filters: TransactionFilters) => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value))
    }
  }
  return queryOptions({
    queryKey: ["admin", "transactions", filters],
    queryFn: () =>
      apiFetch<TransactionPage>(`/admin/transactions?${params.toString()}`),
    // Keep the current page on screen while the next one loads
    placeholderData: keepPreviousData,
  })
}
