import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

import { env } from "@/lib/env"

/** Better Auth client for the backend's admin auth (mounted at /api/admin-auth). */
export const authClient = createAuthClient({
  baseURL: `${env.apiUrl}/api/admin-auth`,
  fetchOptions: { credentials: "include" },
  plugins: [adminClient()],
})

export type Session = typeof authClient.$Infer.Session
