'use client'

import { useChallengeStatus } from '@/core/challenges/hooks/use-challenge-status'
import { CompletionStatus } from '@/core/challenges/user-progression/types'
import { CheckCircle, Circle, CircleDot } from 'lucide-react'

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

export const ChallengeStatus = () => {
  const { status } = useChallengeStatus()
  const { icon, color, label } = statusConfig[status]
  return (
    <div className={`flex items-center gap-1.5 text-${color}-500`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}
