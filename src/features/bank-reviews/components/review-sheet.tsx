import { useState } from "react"
import { CheckCircle2Icon, XCircleIcon } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { formatDateTime } from "@/lib/format"

import {
  useApproveBank,
  useRejectBank,
  type BankReview,
} from "../api/bank-reviews"
import { MatchBadge } from "./match-badge"
import { StatementViewer } from "./statement-viewer"

const DEFAULT_REJECT_REASON =
  "Account holder name does not match the verified identity"

const statusLabel: Record<BankReview["status"], string> = {
  PENDING_REVIEW: "In review",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
}

function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{children}</span>
    </div>
  )
}

/**
 * Check the statement against the member's name and the account details,
 * then approve (registers the account with CeyPay) or reject with a reason.
 */
export function ReviewSheet({
  review,
  onClose,
}: {
  review: BankReview | null
  onClose: () => void
}) {
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState(DEFAULT_REJECT_REASON)
  const approve = useApproveBank()
  const reject = useRejectBank()
  const busy = approve.isPending || reject.isPending

  const close = () => {
    setRejecting(false)
    setReason(DEFAULT_REJECT_REASON)
    onClose()
  }

  const onApprove = async () => {
    if (!review) return
    try {
      await approve.mutateAsync(review.id)
      toast.success("Bank account verified")
      close()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Approve failed")
    }
  }

  const onReject = async () => {
    if (!review || !reason.trim()) return
    try {
      await reject.mutateAsync({ id: review.id, reason: reason.trim() })
      toast.success("Bank account rejected")
      close()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Reject failed")
    }
  }

  return (
    <Sheet open={review !== null} onOpenChange={(open) => !open && close()}>
      <SheetContent className="w-full data-[side=right]:sm:max-w-3xl">
        {review && (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                Bank account review
                <Badge variant="outline">{statusLabel[review.status]}</Badge>
              </SheetTitle>
              <SheetDescription>
                Check the statement shows this account number and a name that
                matches the member.
              </SheetDescription>
            </SheetHeader>

            <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-4 md:grid-cols-[minmax(0,1fr)_16rem]">
              <StatementViewer id={review.id} />

              <div className="flex flex-col gap-4 text-sm">
                <div className="flex flex-col gap-2 rounded-md border bg-muted/40 p-3">
                  <Row label="Member">{review.memberName || "—"}</Row>
                  <Row label="Telegram ID">{review.userId}</Row>
                  <Row label="Account name">{review.accountName}</Row>
                  <Row label="Name match">
                    <MatchBadge score={review.nameMatchScore} />
                  </Row>
                </div>
                <div className="flex flex-col gap-2 rounded-md border bg-muted/40 p-3">
                  <Row label="Bank">{review.bankName}</Row>
                  <Row label="Account">
                    <span className="font-mono">{review.accountNumber}</span>
                  </Row>
                  <Row label="Submitted">
                    {formatDateTime(review.createdAt)}
                  </Row>
                  {review.reviewedAt && (
                    <Row label="Reviewed">
                      {formatDateTime(review.reviewedAt)}
                      <span className="block text-xs font-normal text-muted-foreground">
                        {review.reviewedBy?.replace(/^admin:/, "")}
                      </span>
                    </Row>
                  )}
                </div>
                {review.rejectionReason && (
                  <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive">
                    {review.rejectionReason}
                  </p>
                )}

                {review.status === "PENDING_REVIEW" && rejecting && (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="bank-reject-reason">
                      Reason (sent to the member)
                    </Label>
                    <textarea
                      id="bank-reject-reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      maxLength={1000}
                      rows={4}
                      className="w-full resize-none rounded-md border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
                    />
                  </div>
                )}
              </div>
            </div>

            {review.status === "PENDING_REVIEW" && (
              <SheetFooter className="flex-row justify-end border-t">
                {rejecting ? (
                  <>
                    <Button
                      variant="outline"
                      disabled={busy}
                      onClick={() => setRejecting(false)}
                    >
                      Back
                    </Button>
                    <Button
                      variant="destructive"
                      disabled={busy || !reason.trim()}
                      onClick={() => void onReject()}
                    >
                      {reject.isPending ? "Rejecting…" : "Reject account"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      disabled={busy}
                      onClick={() => setRejecting(true)}
                    >
                      <XCircleIcon className="text-destructive" />
                      Reject
                    </Button>
                    <Button disabled={busy} onClick={() => void onApprove()}>
                      <CheckCircle2Icon />
                      {approve.isPending ? "Approving…" : "Approve"}
                    </Button>
                  </>
                )}
              </SheetFooter>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
