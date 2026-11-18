import { DataTable, useDataTable } from "@/components/data-table"

import type { Transaction } from "../api/transactions"
import { recentTransactionColumns } from "./transactions-columns"

/** Read-only list without pagination (dashboard). */
export function TransactionsTable({
  transactions,
}: {
  transactions: Transaction[]
}) {
  const table = useDataTable({
    data: transactions,
    columns: recentTransactionColumns,
    getRowId: (tx) => tx.id,
  })
  return <DataTable table={table} emptyMessage="No transactions yet" />
}
