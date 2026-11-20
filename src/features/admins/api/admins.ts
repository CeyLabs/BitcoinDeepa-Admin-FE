import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { apiFetch, apiPost } from "@/lib/api"

export const MIN_ADMIN_PASSWORD_LENGTH = 12

export interface AdminUser {
  id: string
  name: string
  email: string
  banned: boolean
  createdAt: string
}

export interface CreateAdminInput {
  email: string
  name: string
  password: string
}

const KEY = ["admin", "admins"] as const

export const adminsQueryOptions = () =>
  queryOptions({
    queryKey: KEY,
    queryFn: () => apiFetch<AdminUser[]>("/admin/admins"),
  })

export function useCreateAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAdminInput) =>
      apiPost<AdminUser>("/admin/admins", input),
    onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }),
  })
}
