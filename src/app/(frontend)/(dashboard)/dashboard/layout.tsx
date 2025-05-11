import { getSessionUser } from '@/core/user'
import { isError } from '@/core/user/result'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const sessionUserResult = await getSessionUser()

  // If there was an error fetching the user (e.g., not logged in) or the user object is null/undefined, trigger notFound
  if (isError(sessionUserResult) || !sessionUserResult.value) {
    notFound()
  }

  // Otherwise, render the children
  return <>{children}</>
}