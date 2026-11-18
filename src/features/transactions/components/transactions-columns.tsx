import { createColumnHelper } from "@tanstack/react-table"

import type {
  DataTableColumns,
  DataTableFeatures,
} from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
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

const column = createColumnHelper<DataTableFeatures, Transaction>()

const date = column.accessor("createdAt", {
  header: "Date",
  cell: (info) => formatDateTime(info.getValue()),
  meta: { className: "whitespace-nowrap" },
})
const paymentId = column.accessor("id", {
  header: "Payment ID",
  meta: { className: "font-mono text-xs" },
})
const member = column.accessor("user", {
  header: "Member",
  cell: (info) => {
    const user = info.getValue()
    return user ? (
      <div className="flex flex-col">
        <span>{user.name}</span>
        <span className="text-xs text-muted-foreground">{user.id}</span>
      </div>
    ) : (
      "—"
    )
  },
})
const plan = column.accessor("packageName", {
  header: "Plan",
  cell: (info) => info.getValue() ?? "—",
})
const amount = column.accessor("grossLkr", {
  header: "Amount",
  cell: (info) => {
    const value = info.getValue()
    return value === null ? "—" : formatLkr(value)
  },
  meta: { className: "text-right tabular-nums" },
})
const sats = column.accessor("satoshis", {
  header: "Sats",
  cell: (info) => {
    const value = info.getValue()
    return value === null ? "—" : formatNumber(value)
  },
  meta: { className: "text-right tabular-nums" },
})
const status = column.accessor("status", {
  header: "Status",
  cell: (info) => (
    <Badge variant={statusVariant[info.getValue()]}>
      {info.getValue().toLowerCase()}
    </Badge>
  ),
})
const settled = column.accessor("settled", {
  header: "Settled",
  cell: (info) => (info.getValue() ? "Yes" : "No"),
})

/** Full set for the Transactions page */
export const transactionColumns: DataTableColumns<Transaction> = [
  date,
  paymentId,
  member,
  plan,
  amount,
  sats,
  status,
  settled,
]

/** Compact set for the dashboard's recent list */
export const recentTransactionColumns: DataTableColumns<Transaction> = [
  date,
  member,
  plan,
  amount,
  sats,
  status,
  settled,
]
