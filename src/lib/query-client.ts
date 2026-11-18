import { QueryCache, QueryClient } from "@tanstack/react-query"

import { ApiError } from "@/lib/api"

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // Session expired or revoked (401), or no longer an admin (403): start
    // over at the login page
    onError: (error) => {
      if (
        error instanceof ApiError &&
        (error.status === 401 || error.status === 403)
      ) {
        const here = window.location.pathname + window.location.search
        window.location.assign(`/login?redirect=${encodeURIComponent(here)}`)
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: (count, error) =>
        !(error instanceof ApiError && error.status < 500) && count < 1,
      refetchOnWindowFocus: false,
    },
  },
})
