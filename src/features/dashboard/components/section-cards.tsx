import { useQuery } from "@tanstack/react-query"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatBtc, formatLkr, formatNumber } from "@/lib/format"

import { summaryQueryOptions } from "../api/analytics"

function StatCard({
  label,
  value,
  primary,
  secondary,
}: {
  label: string
  value: string
  primary: string
  secondary: string
}) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 font-medium">{primary}</div>
        <div className="text-muted-foreground">{secondary}</div>
      </CardFooter>
    </Card>
  )
}

const grid =
  "grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card"

export function SectionCards() {
  const { data, isPending, isError, error } = useQuery(summaryQueryOptions())

  if (isPending) {
    return (
      <div className={grid}>
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <p className="px-4 text-sm text-destructive lg:px-6">
        Couldn&apos;t load the summary: {error.message}
      </p>
    )
  }

  const { users, subscriptions, payments } = data
  return (
    <div className={grid}>
      <StatCard
        label="Members"
        value={formatNumber(users.total)}
        primary={`+${formatNumber(users.newLast30Days)} in the last 30 days`}
        secondary={`${formatNumber(users.kycApproved)} KYC approved`}
      />
      <StatCard
        label="Active subscriptions"
        value={formatNumber(subscriptions.active)}
        primary={`${formatNumber(subscriptions.total)} subscriptions all time`}
        secondary="Recurring PayHere plans"
      />
      <StatCard
        label="Collected"
        value={formatLkr(payments.grossLkr)}
        primary={`${formatLkr(payments.grossLkrLast30Days)} in the last 30 days`}
        secondary={`${formatNumber(payments.successful)} successful payments`}
      />
      <StatCard
        label="Bitcoin purchased"
        value={formatBtc(payments.satoshis)}
        primary={`${formatNumber(payments.satoshis)} sats`}
        secondary={`Platform fees: ${formatLkr(payments.bitcoindeepaFeesLkr)}`}
      />
    </div>
  )
}
