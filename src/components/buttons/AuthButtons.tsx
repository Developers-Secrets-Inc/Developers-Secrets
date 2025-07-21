'use client'

import { AuthButtonsClient } from "./AuthButtons.client"
import { useUser } from "@/core/users/hooks/use-user"

export const AuthButtons = () => {
  const { user, isLoading } = useUser()
  console.log(user)

  return <AuthButtonsClient user={user} isLoading={isLoading} />
}
