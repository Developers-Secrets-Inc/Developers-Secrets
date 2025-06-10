'use client'

import { useChallengeUserStatus } from '@/core/challenges/hooks/use-challenge-user-status'
import { useParams } from 'next/navigation'
import { CheckCircle, Circle, CircleDot } from 'lucide-react'
import { useSessionUser } from '@/core/user/hooks/use-user'
import { CompletionStatus } from '@/core/challenges/user-progression/types'

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
  const { user, isLoading: isLoadingUser } = useSessionUser()

  const { status: visualStatus } = useChallengeUserStatus(challengeId, user?.id || '')

  if (isLoadingUser || !user?.id) {
    return null
  }

  const { icon, color, label } = statusConfig[visualStatus]
  return (
    <div className={`flex items-center gap-1.5 text-${color}-500`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}
