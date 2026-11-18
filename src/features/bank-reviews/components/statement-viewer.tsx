import { useQuery } from "@tanstack/react-query"
import { ExternalLinkIcon } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"

import { statementQueryOptions } from "../api/bank-reviews"

/** Statements are stored as <uuid>.pdf / .jpg / .png, so the link says the type. */
const isImage = (url: string) => /\.(png|jpe?g)$/i.test(new URL(url).pathname)

/**
 * The uploaded bank statement, shown inline so it can be checked against the
 * name and account number. The link is a 5-minute presigned R2 URL.
 */
export function StatementViewer({ id }: { id: string }) {
  const { data, isPending, isError, error } = useQuery(
    statementQueryOptions(id)
  )

  if (isPending) return <Skeleton className="h-full min-h-80 w-full" />
  if (isError) {
    return (
      <p className="text-sm text-destructive">
        Couldn&apos;t load the statement: {error.message}
      </p>
    )
  }

  return (
    <div className="flex h-full min-h-80 flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Bank statement</span>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-foreground"
        >
          Open in new tab <ExternalLinkIcon className="size-3" />
        </a>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden rounded-md border bg-muted">
        {isImage(data.url) ? (
          <img
            src={data.url}
            alt="Bank statement"
            className="h-full w-full object-contain"
          />
        ) : (
          <iframe
            src={`${data.url}#view=FitH`}
            title="Bank statement"
            className="h-full w-full border-0 bg-white"
          />
        )}
      </div>
    </div>
  )
}
