import { createColumnHelper } from "@tanstack/react-table"
import { EyeIcon } from "lucide-react"

import type {
  DataTableColumns,
  DataTableFeatures,
} from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { formatDateTime } from "@/lib/format"

import type { BankReview } from "../api/bank-reviews"
import { MatchBadge } from "./match-badge"

const column = createColumnHelper<DataTableFeatures, BankReview>()

export function bankReviewColumns(
  onReview: (review: BankReview) => void
): DataTableColumns<BankReview> {
  return column.columns([
    column.accessor("verifiedName", {
      header: "Member (verified name)",
      cell: (info) => (
        <div className="flex flex-col">
          <span>{info.getValue() ?? "—"}</span>
          <span className="text-xs text-muted-foreground">
            {info.row.original.userId}
          </span>
        </div>
      ),
    }),
    column.accessor("accountName", {
      header: "Account name",
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    column.accessor("nameMatchScore", {
      header: "Match",
      cell: (info) => <MatchBadge score={info.getValue()} />,
    }),
    column.accessor("accountNumber", {
      header: "Account",
      cell: (info) => (
        <div className="flex flex-col">
          <span className="font-mono text-sm">{info.getValue()}</span>
          <span className="text-xs text-muted-foreground">
            {info.row.original.bankName}
          </span>
        </div>
      ),
    }),
    column.accessor("createdAt", {
      header: "Submitted",
      cell: (info) => formatDateTime(info.getValue()),
      meta: { className: "whitespace-nowrap" },
    }),
    column.accessor("reviewedAt", {
      header: "Reviewed",
      cell: (info) => {
        const at = info.getValue()
        if (!at) return <span className="text-muted-foreground">—</span>
        return (
          <div className="flex flex-col">
            <span className="whitespace-nowrap">{formatDateTime(at)}</span>
            <span className="text-xs text-muted-foreground">
              {info.row.original.reviewedBy?.replace(/^admin:/, "")}
            </span>
          </div>
        )
      },
    }),
    column.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: (info) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onReview(info.row.original)}
        >
          <EyeIcon />
          {info.row.original.status === "PENDING_REVIEW" ? "Review" : "View"}
        </Button>
      ),
      meta: { className: "text-right" },
    }),
  ])
}
