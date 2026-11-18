import { useQuery } from "@tanstack/react-query"

import { sessionQueryOptions } from "../api/session"

export function useSession() {
  return useQuery(sessionQueryOptions)
}
