'use client'

import { useEffect } from 'react'
import useLoginEntries from "../hook/use-login-entries"

export const TrackDailyEntry = ({ 
  children, 
  userId 
}: { 
  children: React.ReactNode, 
  userId: string 
}) => {
  const { recordTodayLogin, hasLoggedInToday } = useLoginEntries(userId)

  useEffect(() => {
    if (!hasLoggedInToday) {
      recordTodayLogin()
    }
  }, [recordTodayLogin, hasLoggedInToday])

  return <>{children}</>
}
