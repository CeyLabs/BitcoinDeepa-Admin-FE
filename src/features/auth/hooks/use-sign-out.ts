import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"

import { authClient } from "../api/auth-client"

export function useSignOut() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut()
      if (error) throw new Error(error.message ?? "Sign out failed")
    },
    onSuccess: async () => {
      // Drop everything cached for this admin, including the session
      queryClient.clear()
      await navigate("/login", { replace: true })
    },
  })
}
