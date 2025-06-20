'use client'

import { useChallengeUserStatus } from '@/core/challenges/hooks/use-challenge-user-status'
import { CheckCircle, Circle, CircleDot } from 'lucide-react'
import { CompletionStatus } from '@/core/challenges/user-progression/types'
import { Skeleton } from '@/components/ui/skeleton'

const statusConfig: Record<
  CompletionStatus,
  { icon: React.ReactNode; color: string; label: string }
> = {
  completed: {
    icon: <CheckCircle size={16} />,
    color: 'green',
    label: 'Completed',
  },
  in_progress: {
    icon: <CircleDot size={16} />,
    color: 'amber',
    label: 'In Progress',
  },
  not_started: {
    icon: <Circle size={16} />,
    color: 'gray',
    label: 'Not Started',
  },
}
export const ChallengeStatus = ({ challengeId }: { challengeId: number }) => {
  const { status: visualStatus, isLoading: isLoadingStatus } = useChallengeUserStatus(challengeId)

  if (isLoadingStatus) {
    return <Skeleton className="h-5 w-24" />
  }

  const { icon, color, label } = statusConfig[visualStatus]
  
  return (
    <div className={`flex items-center gap-1.5 text-${color}-500`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}
