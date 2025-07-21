'use client'

import useLoginEntries from '../hook/use-login-entries'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { FlameIcon } from 'lucide-react'

// TODO: Change color based on activeDays
const PureDailyEntriesBadge = ({ activeDays }: { activeDays: number }) => {
  return (
    <Badge variant="outline" className="gap-1 bg-orange-500/10 text-orange-500">
      <FlameIcon size={12} aria-hidden="true" />
      Streak : {activeDays} {activeDays === 1 ? 'Day' : 'Days'}
    </Badge>
  )
}

export const DailyEntriesBadge = ({ userId }: { userId: string }) => {
  const { activeDays, isLoading } = useLoginEntries(userId)

  if (isLoading) {
    return <Skeleton className="w-12 h-4" />
  }

  return <PureDailyEntriesBadge activeDays={activeDays} />
}


/*

We should add a dialog to show the streak history. I'm also wondering if this dialog could be the main place for all streaks. There would be two main streak (login and challenges completion). We may use a tooltip where for each day we display the completed challenges.

*/