import React from 'react'
import { getUserPartCompletionStatus } from '@/core/courses/progression/completion-status'
import { getSessionUser } from '@/core/user'
import { CoursePartStatusClient } from './part-status-client'
import { Skeleton } from '@/components/ui/skeleton'
import { Circle } from 'lucide-react'
import { CompletionStatus } from '@/core/challenges/user-progression/types'

interface CoursePartStatusProps {
  partId: number
}

export const CoursePartStatus = async ({ partId }: CoursePartStatusProps) => {
  const userResult = await getSessionUser()
  const userId = userResult.success ? userResult.value.id : null

  if (!userId) {
    return (
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Circle size={16} aria-hidden="true" />
        <span className="text-sm font-medium">Not Started</span>
      </div>
    )
  }

  const initialStatus: CompletionStatus = await getUserPartCompletionStatus(userId, partId)

  return <CoursePartStatusClient partId={partId} userId={userId} initialStatus={initialStatus} />
}

export const PartStatusSkeleton = () => {
  return <Skeleton className="h-5 w-28 rounded" />
}
