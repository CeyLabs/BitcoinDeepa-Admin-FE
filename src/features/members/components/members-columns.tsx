import { createColumnHelper } from "@tanstack/react-table"

import type {
  DataTableColumns,
  DataTableFeatures,
} from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { formatLkr, formatNumber } from "@/lib/format"

import type { KycStatus, Member } from "../api/members"

export const kycLabel = (status: KycStatus) =>
  status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " ")

export const kycVariant: Record<
  KycStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  APPROVED: "default",
  IN_PROGRESS: "secondary",
  IN_REVIEW: "secondary",
  NOT_STARTED: "outline",
  ABANDONED: "outline",
  EXPIRED: "outline",
  KYC_EXPIRED: "outline",
  DECLINED: "destructive",
}

const column = createColumnHelper<DataTableFeatures, Member>()

// Built without an annotation so each cell keeps its own value type
const columns = column.columns([
  column.accessor("name", {
    header: "Member",
    cell: (info) => (
      <div className="flex flex-col">
        <span>{info.getValue() || "—"}</span>
        <span className="text-xs text-muted-foreground">
          {info.row.original.id}
        </span>
      </div>
    ),
  }),
  column.accessor("email", {
    header: "Contact",
    cell: (info) => (
      <div className="flex flex-col">
        <span>{info.getValue() ?? "—"}</span>
        <span className="text-xs text-muted-foreground">
          {info.row.original.phone ?? ""}
        </span>
      </div>
    ),
  }),
  column.accessor("city", {
    header: "City",
    cell: (info) => info.getValue() ?? "—",
  }),
  column.accessor("kycStatus", {
    header: "KYC",
    cell: (info) => (
      <Badge variant={kycVariant[info.getValue()]}>
        {kycLabel(info.getValue())}
      </Badge>
    ),
  }),
  column.accessor("activePlan", {
    header: "Active plan",
    cell: (info) => info.getValue() ?? "—",
  }),
  column.accessor("totalPaidLkr", {
    header: "Paid",
    cell: (info) => {
      const unsettled = info.row.original.unsettledLkr
      return (
        <div className="flex flex-col items-end">
          <span>{formatLkr(info.getValue())}</span>
          {unsettled > 0 && (
            <span className="text-xs text-amber-700 dark:text-amber-400">
              +{formatLkr(unsettled)} unsettled
            </span>
          )}
        </div>
      )
    },
    meta: { className: "text-right tabular-nums" },
  }),
  column.accessor("satoshis", {
    header: "Sats",
    cell: (info) => formatNumber(info.getValue()),
    meta: { className: "text-right tabular-nums" },
  }),
  column.accessor("joinedAt", {
    header: "Joined",
    cell: (info) =>
      new Date(info.getValue()).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    meta: { className: "whitespace-nowrap" },
  }),
])

export const memberColumns: DataTableColumns<Member> = columns
