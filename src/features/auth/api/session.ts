import { queryOptions } from "@tanstack/react-query"

import { authClient, type Session } from "./auth-client"

export const ADMIN_ROLE = "admin"

export const sessionQueryOptions = queryOptions({
  queryKey: ["auth", "session"],
  queryFn: async (): Promise<Session | null> => {
    const { data, error } = await authClient.getSession()
    if (error) throw new Error(error.message ?? "Failed to load session")
    return data
  },
  staleTime: 5 * 60_000,
  // Route loaders wait on this; don't stall navigation retrying an unreachable API
  retry: false,
})

export const isAdmin = (session: Session | null | undefined) =>
  session?.user.role === ADMIN_ROLE
