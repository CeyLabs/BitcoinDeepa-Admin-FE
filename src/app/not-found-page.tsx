import { Link } from "react-router"

import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-start gap-4 p-4 lg:p-6">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Button nativeButton={false} render={<Link to="/dashboard" />}>
        Back to dashboard
      </Button>
    </div>
  )
}
