import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import type { PageSize } from "@/components/data-table"
import { apiFetch, apiPost } from "@/lib/api"

import type { KycStatus } from "@/features/members/api/members"

export const BANK_REVIEW_STATUSES = [
  "PENDING_REVIEW",
  "VERIFIED",
  "REJECTED",
] as const
export type BankReviewStatus = (typeof BANK_REVIEW_STATUSES)[number]

export interface BankReview {
  id: string
  userId: string
  /** Telegram profile name: the member can change it, not proof of identity */
  memberName: string
  /** Name Didit read from the member's ID: what the statement must match */
  verifiedName: string | null
  kycStatus: KycStatus
  accountName: string
  /** 0..1 match of accountName against verifiedName (a hint only) */
  nameMatchScore: number | null
  bankCode: number
  bankName: string
  accountNumber: string
  status: BankReviewStatus
  rejectionReason: string | null
  reviewedBy: string | null
  reviewedAt: string | null
  createdAt: string
}

export interface BankReviewPage {
  items: BankReview[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}

export interface BankReviewFilters {
  status?: BankReviewStatus
  page?: number
  pageSize?: PageSize
  q?: string | null
}

const KEY = ["admin", "bank-reviews"] as const

export const bankReviewsQueryOptions = (filters: BankReviewFilters) => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value))
    }
  }
  return queryOptions({
    queryKey: [...KEY, "list", filters],
    queryFn: () =>
      apiFetch<BankReviewPage>(`/admin/bank-reviews?${params.toString()}`),
    placeholderData: keepPreviousData,
  })
}

export const pendingBankReviewsQueryOptions = () =>
  queryOptions({
    queryKey: [...KEY, "pending-count"],
    queryFn: () =>
      apiFetch<{ pending: number }>("/admin/bank-reviews/pending-count"),
    refetchInterval: 60_000,
  })

/**
 * Presigned links expire after 5 minutes: never serve a stale one, and renew
 * it while the sheet is open so "Open in new tab" keeps working.
 */
export const statementQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [...KEY, "statement", id],
    queryFn: () =>
      apiFetch<{ url: string }>(`/admin/bank-reviews/${id}/statement`),
    staleTime: 4 * 60_000,
    gcTime: 4 * 60_000,
    refetchInterval: 4 * 60_000,
  })

export function useApproveBank() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiPost<{ id: string; status: BankReviewStatus }>(
        `/admin/bank-reviews/${id}/approve`
      ),
    onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }),
  })
}

export function useRejectBank() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiPost<{ id: string; status: BankReviewStatus }>(
        `/admin/bank-reviews/${id}/reject`,
        { reason }
      ),
    onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }),
  })
}
