import {
  FlexRender,
  type CellData,
  type RowData,
  type TableFeatures,
} from "@tanstack/react-table"
import { cn } from "cn"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { DataTableInstance } from "./use-data-table"

/* eslint-disable @typescript-eslint/no-unused-vars -- generics must match TanStack's declaration */
declare module "@tanstack/react-table" {
  interface ColumnMeta<
    in out TFeatures extends TableFeatures,
    in out TData extends RowData,
    TValue extends CellData = CellData,
  > {
    /** Extra classes for this column's header and cells, e.g. "text-right" */
    className?: string
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export function DataTable<TData extends RowData>({
  table,
  emptyMessage = "No results",
  dimmed = false,
}: {
  table: DataTableInstance<TData>
  emptyMessage?: React.ReactNode
  /** Fade the rows, e.g. while the next page loads */
  dimmed?: boolean
}) {
  const rows = table.getRowModel().rows
  const columnCount = table.getAllLeafColumns().length

  return (
    <Table className={cn(dimmed && "opacity-60 transition-opacity")}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className={header.column.columnDef.meta?.className}
              >
                {header.isPlaceholder ? null : <FlexRender header={header} />}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columnCount}
              className="h-24 text-center text-muted-foreground"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cell.column.columnDef.meta?.className}
                >
                  <FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
