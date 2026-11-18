import { queryOptions } from "@tanstack/react-query"

import { apiFetch } from "@/lib/api"

export interface AnalyticsSummary {
  users: { total: number; kycApproved: number; newLast30Days: number }
  subscriptions: { active: number; total: number }
  payments: {
    successful: number
    grossLkr: number
    netLkr: number
    bitcoindeepaFeesLkr: number
    satoshis: number
    grossLkrLast30Days: number
  }
  /** SUCCESS payments whose sats weren't sent (yet); not in `payments` */
  unsettled: { count: number; grossLkr: number; satoshis: number }
}

export interface DailyPoint {
  date: string
  /** Settled payments */
  grossLkr: number
  payments: number
  /** Paid, sats not sent (yet) */
  unsettledGrossLkr: number
  newUsers: number
}

export const ANALYTICS_RANGES = [7, 30, 90] as const
export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number]

const keys = {
  all: ["admin", "analytics"] as const,
  summary: () => [...keys.all, "summary"] as const,
  daily: (days: AnalyticsRange) => [...keys.all, "daily", days] as const,
}

export const summaryQueryOptions = () =>
  queryOptions({
    queryKey: keys.summary(),
    queryFn: () => apiFetch<AnalyticsSummary>("/admin/analytics/summary"),
  })

export const dailyQueryOptions = (days: AnalyticsRange) =>
  queryOptions({
    queryKey: keys.daily(days),
    queryFn: () =>
      apiFetch<DailyPoint[]>(`/admin/analytics/daily?days=${days}`),
  })
