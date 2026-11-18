import { useMutation, useQueryClient } from "@tanstack/react-query"

import { authClient } from "../api/auth-client"
import { sessionQueryOptions } from "../api/session"

export interface SignInInput {
  email: string
  password: string
}

export function useSignIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ email, password }: SignInInput) => {
      const { error } = await authClient.signIn.email({ email, password })
      if (error) throw new Error(error.message ?? "Sign in failed")
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: sessionQueryOptions.queryKey }),
  })
}
