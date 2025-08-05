'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { SubscriptionDialog } from './subscription-dialog'

export const HomeClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams()
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false)

  useEffect(() => {
    const subscribed = searchParams.get('subscribed')
    if (subscribed === 'true') {
      setShowSubscriptionDialog(true)
    }
  }, [searchParams])

  return (
    <>
      {children}
      <SubscriptionDialog 
        open={showSubscriptionDialog} 
        onClose={() => setShowSubscriptionDialog(false)} 
      />
    </>
  )
}
