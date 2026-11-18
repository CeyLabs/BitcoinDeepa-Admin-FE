import {
  functionalUpdate,
  rowPaginationFeature,
  tableFeatures,
  useTable,
  type ColumnDef,
  type PaginationState,
  type RowData,
} from "@tanstack/react-table"

/** Features every admin table uses (pagination is done on the server). */
export const dataTableFeatures = tableFeatures({ rowPaginationFeature })
export type DataTableFeatures = typeof dataTableFeatures

export type DataTableColumns<TData extends RowData> = ColumnDef<
  DataTableFeatures,
  TData,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- each column has its own value type
  any
>[]

export interface ServerPagination {
  /** 1-based, like the API and the URL */
  page: number
  pageSize: number
  /** Total rows across all pages (from the API) */
  total: number
  onChange: (next: { page: number; pageSize: number }) => void
}

/**
 * TanStack Table set up for server-side data: rows are already the current
 * page, and page changes go through `pagination.onChange` (e.g. the URL).
 */
export function useDataTable<TData extends RowData>({
  data,
  columns,
  pagination,
  getRowId,
}: {
  data: TData[]
  columns: DataTableColumns<TData>
  pagination?: ServerPagination
  getRowId?: (row: TData) => string
}) {
  const state: PaginationState = {
    pageIndex: (pagination?.page ?? 1) - 1,
    pageSize: pagination?.pageSize ?? data.length,
  }

  return useTable({
    features: dataTableFeatures,
    columns,
    data,
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
    manualPagination: true,
    rowCount: pagination?.total ?? data.length,
    state: { pagination: state },
    onPaginationChange: (updater) => {
      const next = functionalUpdate(updater, state)
      pagination?.onChange({
        page: next.pageIndex + 1,
        pageSize: next.pageSize,
      })
    },
  })
}

export type DataTableInstance<TData extends RowData> = ReturnType<
  typeof useDataTable<TData>
>
