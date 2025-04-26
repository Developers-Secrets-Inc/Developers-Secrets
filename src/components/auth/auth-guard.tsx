import { getUser } from '@/core/user'
import { redirect } from 'next/navigation'
import React from 'react'

interface AuthGuardProps {
  children: React.ReactNode
}

export async function AuthGuard({ children }: AuthGuardProps) {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
    // return null // redirect() throws an error, so this is unreachable but keeps TS happy
  }

  return <>{children}</>
}
