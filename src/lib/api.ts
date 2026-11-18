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
  return readJson<T>(res)
}

/** POST JSON to the backend, sending the admin session cookie. */
export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${env.apiUrl}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body ?? {}),
  })
  return readJson<T>(res)
}

async function readJson<T>(res: Response): Promise<T> {
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
