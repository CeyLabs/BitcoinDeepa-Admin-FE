import { useQuery } from "@tanstack/react-query"
import { ArrowRightIcon } from "lucide-react"
import { Link } from "react-router"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  TransactionsTable,
  transactionsQueryOptions,
} from "@/features/transactions"

export function RecentTransactions() {
  const { data, isPending, isError, error } = useQuery(
    transactionsQueryOptions({ pageSize: 10 })
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
        <CardDescription>Latest 10 PayHere payments</CardDescription>
        <CardAction>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link to="/transactions" />}
          >
            View all
            <ArrowRightIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-64 w-full" />
        ) : isError ? (
          <p className="text-sm text-destructive">
            Couldn&apos;t load transactions: {error.message}
          </p>
        ) : data.items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No transactions yet
          </p>
        ) : (
          <TransactionsTable transactions={data.items} />
        )}
      </CardContent>
    </Card>
  )
}
