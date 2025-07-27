'use client'

import { useChallengeUserStatus } from '@/core/challenges/hooks/use-challenge-user-status'
import { CheckCircle, Circle, CircleDot } from 'lucide-react'
import { CompletionStatus } from '@/core/challenges/user-progression/types'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/core/users/contexts/user-context'
import { getCompletionStatus } from '@/core/challenges/user-progression/completion-status'

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
  const { user } = useUser()
  const { status: visualStatus, isLoading: isLoadingStatus } = useChallengeUserStatus(challengeId, user.id)

  console.log(visualStatus)

  if (isLoadingStatus) {
    return <Skeleton className="h-5 w-24" />
  }

  const { icon, color, label } = statusConfig[visualStatus ?? 'not_started']

  return (
    <div className={`flex items-center gap-1.5 text-${color}-500`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}
