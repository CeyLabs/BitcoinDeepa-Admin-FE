import { createColumnHelper } from "@tanstack/react-table"

import type {
  DataTableColumns,
  DataTableFeatures,
} from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/lib/format"

import type { AdminUser } from "../api/admins"

const column = createColumnHelper<DataTableFeatures, AdminUser>()

const columns = column.columns([
  column.accessor("name", { header: "Name" }),
  column.accessor("email", { header: "Email" }),
  column.accessor("banned", {
    header: "Status",
    cell: (info) =>
      info.getValue() ? (
        <Badge variant="destructive">Banned</Badge>
      ) : (
        <Badge variant="secondary">Active</Badge>
      ),
  }),
  column.accessor("createdAt", {
    header: "Added",
    cell: (info) => formatDateTime(info.getValue()),
    meta: { className: "whitespace-nowrap" },
  }),
])

export const adminColumns: DataTableColumns<AdminUser> = columns
