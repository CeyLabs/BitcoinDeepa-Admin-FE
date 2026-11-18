import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDateTime, formatLkr, formatNumber } from "@/lib/format"

import type { Transaction, TransactionStatus } from "../api/transactions"

const statusVariant: Record<
  TransactionStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  SUCCESS: "default",
  PENDING: "secondary",
  CANCELLED: "outline",
  FAILED: "destructive",
  CHARGEBACK: "destructive",
}

export function TransactionsTable({
  transactions,
  showPaymentId = false,
}: {
  transactions: Transaction[]
  showPaymentId?: boolean
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          {showPaymentId && <TableHead>Payment ID</TableHead>}
          <TableHead>Member</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Sats</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Settled</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell className="whitespace-nowrap">
              {formatDateTime(tx.createdAt)}
            </TableCell>
            {showPaymentId && (
              <TableCell className="font-mono text-xs">{tx.id}</TableCell>
            )}
            <TableCell>
              {tx.user ? (
                <div className="flex flex-col">
                  <span>{tx.user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {tx.user.id}
                  </span>
                </div>
              ) : (
                "—"
              )}
            </TableCell>
            <TableCell>{tx.packageName ?? "—"}</TableCell>
            <TableCell className="text-right tabular-nums">
              {tx.grossLkr === null ? "—" : formatLkr(tx.grossLkr)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {tx.satoshis === null ? "—" : formatNumber(tx.satoshis)}
            </TableCell>
            <TableCell>
              <Badge variant={statusVariant[tx.status]}>
                {tx.status.toLowerCase()}
              </Badge>
            </TableCell>
            <TableCell>{tx.settled ? "Yes" : "No"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
