'use client'

import { useCoursePartUserStatus } from '@/api/courses/progression/hooks/use-course-part-completion-status'
import { Skeleton } from '@/components/ui/skeleton'
import { CompletionStatus } from '@/core/challenges/user-progression/types'
import { useUser } from '@/core/users/contexts/user-context'
import { isNone } from '@/lib/maybe'
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
export const PartStatus = ({ partId }: { partId: number }) => {
  const { user } = useUser()
  const { status: visualStatus, isLoading: isLoadingStatus } = useCoursePartUserStatus(partId, user.id)


  if (isLoadingStatus) {
    return <Skeleton className="h-5 w-24" />
  }

  const { icon, color, label } = statusConfig[
    !visualStatus || isNone(visualStatus) || !visualStatus.value?.completionStatus 
      ? 'not_started' 
      : visualStatus.value.completionStatus
  ]

  return (
    <div className={`flex items-center gap-1.5 text-${color}-500`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}
