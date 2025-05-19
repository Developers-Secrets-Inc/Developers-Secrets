'use client'

import { useSessionUser } from "@/core/user/hooks/use-user"
import { AuthButtonsClient } from "./AuthButtons.client"
import { Skeleton } from "../ui/skeleton"

export const AuthButtons = () => {
  const { user, isLoading } = useSessionUser()

  return <AuthButtonsClient user={user} isLoading={isLoading} />
}
