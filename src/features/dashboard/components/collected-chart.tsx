import { useQuery } from "@tanstack/react-query"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { formatDay, formatLkr, formatNumber } from "@/lib/format"

import {
  ANALYTICS_RANGES,
  dailyQueryOptions,
  type AnalyticsRange,
} from "../api/analytics"
import { useAnalyticsRange } from "../hooks/use-analytics-range"

const chartConfig = {
  grossLkr: { label: "Settled", color: "var(--primary)" },
  unsettledGrossLkr: { label: "Unsettled", color: "var(--chart-4)" },
} satisfies ChartConfig

export function CollectedChart() {
  const [range, setRange] = useAnalyticsRange()
  const { data, isPending, isError, error } = useQuery(dailyQueryOptions(range))

  const total = data?.reduce((sum, day) => sum + day.grossLkr, 0) ?? 0
  const payments = data?.reduce((sum, day) => sum + day.payments, 0) ?? 0
  const unsettled =
    data?.reduce((sum, day) => sum + day.unsettledGrossLkr, 0) ?? 0

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Collected (LKR)</CardTitle>
        <CardDescription>
          {data
            ? `${formatLkr(total)} settled from ${formatNumber(payments)} payments in the last ${range} days${unsettled > 0 ? ` · ${formatLkr(unsettled)} unsettled` : ""}`
            : `Last ${range} days`}
        </CardDescription>
        <CardAction>
          <ToggleGroup
            multiple={false}
            value={[String(range)]}
            onValueChange={(value) => {
              const days = Number(value[0])
              if (ANALYTICS_RANGES.includes(days as AnalyticsRange)) {
                void setRange(days as AnalyticsRange)
              }
            }}
            variant="outline"
            size="sm"
          >
            {ANALYTICS_RANGES.map((days) => (
              <ToggleGroupItem key={days} value={String(days)}>
                {days}d
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isPending ? (
          <Skeleton className="h-[250px] w-full" />
        ) : isError ? (
          <p className="text-sm text-destructive">
            Couldn&apos;t load the chart: {error.message}
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={data}>
              <defs>
                <linearGradient id="fillCollected" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-grossLkr)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-grossLkr)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={formatDay}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={48}
                tickFormatter={(value: number) =>
                  new Intl.NumberFormat("en", { notation: "compact" }).format(
                    value
                  )
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => formatDay(String(value))}
                    formatter={(value) => formatLkr(Number(value))}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="grossLkr"
                type="monotone"
                fill="url(#fillCollected)"
                stroke="var(--color-grossLkr)"
              />
              <Area
                dataKey="unsettledGrossLkr"
                type="monotone"
                fill="var(--color-unsettledGrossLkr)"
                fillOpacity={0.15}
                stroke="var(--color-unsettledGrossLkr)"
                strokeDasharray="4 4"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
