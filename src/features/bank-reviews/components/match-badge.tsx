import { cn } from "cn"

import { Badge } from "@/components/ui/badge"

/** Account name vs member name. A hint for the reviewer, not a decision. */
export function MatchBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-muted-foreground">—</span>
  return (
    <Badge
      variant="outline"
      className={cn(
        "tabular-nums",
        score >= 0.9
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          : score >= 0.6
            ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400"
            : "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400"
      )}
    >
      {Math.round(score * 100)}%
    </Badge>
  )
}
