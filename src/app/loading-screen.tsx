import { Loader2Icon } from "lucide-react"

/** Shown while the first route's loaders (e.g. the session check) run. */
export function LoadingScreen() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
    </div>
  )
}
