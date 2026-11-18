import { keepPreviousData, queryOptions } from "@tanstack/react-query"

import type { PageSize } from "@/components/data-table"
import { apiFetch } from "@/lib/api"

export const KYC_STATUSES = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "IN_REVIEW",
  "APPROVED",
  "DECLINED",
  "KYC_EXPIRED",
  "EXPIRED",
  "ABANDONED",
] as const
export type KycStatus = (typeof KYC_STATUSES)[number]

export const SUBSCRIPTION_FILTERS = ["active", "none"] as const
export type SubscriptionFilter = (typeof SUBSCRIPTION_FILTERS)[number]

export interface Member {
  id: string
  name: string
  email: string | null
  phone: string | null
  city: string | null
  country: string | null
  kycStatus: KycStatus
  joinedAt: string
  activePlan: string | null
  /** Settled payments: paid and sats sent */
  totalPaidLkr: number
  satoshis: number
  /** Paid, sats not sent (yet) */
  unsettledLkr: number
}

export interface MemberPage {
  items: Member[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}

export interface MemberFilters {
  page?: number
  pageSize?: PageSize
  kyc?: KycStatus | null
  subscription?: SubscriptionFilter | null
  q?: string | null
}

export const membersQueryOptions = (filters: MemberFilters) => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value))
    }
  }
  return queryOptions({
    queryKey: ["admin", "members", filters],
    queryFn: () => apiFetch<MemberPage>(`/admin/members?${params.toString()}`),
    placeholderData: keepPreviousData,
  })
}
