import { env } from "@/lib/env"

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

/** GET a JSON endpoint on the backend, sending the admin session cookie. */
export async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${env.apiUrl}${path}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  })
  if (!res.ok) {
    let message = res.statusText || "Request failed"
    try {
      const body = (await res.json()) as { message?: unknown }
      if (typeof body.message === "string") message = body.message
    } catch {
      // not JSON
    }
    throw new ApiError(res.status, message)
  }
  return (await res.json()) as T
}
