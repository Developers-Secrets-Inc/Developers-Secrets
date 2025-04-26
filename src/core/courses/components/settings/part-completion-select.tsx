'use client'

import React, { useState, useEffect } from 'react'
import { useCoursePartCompletionStatus } from '@/core/courses/hooks/use-course-part-completion-status'
import type { CompletionStatus } from '@/core/courses/hooks/use-course-part-completion-status'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { getSessionUser } from '@/core/user'

interface PartCompletionSelectProps {
  partId: number
  initialStatus: CompletionStatus
}

const statusLabels: Record<CompletionStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
}

export const PartCompletionSelect = ({ partId, initialStatus }: PartCompletionSelectProps) => {
  const [userId, setUserId] = useState<string | null>(null)
  const [isUserLoading, setIsUserLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResult = await getSessionUser()
        if (userResult.success) {
          setUserId(userResult.value.id)
        } else {
          setUserId(null)
        }
      } catch (error) {
        console.error('Failed to fetch session user:', error)
        setUserId(null)
      } finally {
        setIsUserLoading(false)
      }
    }
    fetchUser()
  }, [])

  const { status, updateStatus, isLoading, isInitialLoading, error } =
    useCoursePartCompletionStatus({
      partId,
      userId: userId ?? '',
      initialStatus,
      enabled: !!userId && !isUserLoading,
    })

  const handleStatusChange = (value: string) => {
    if (value === 'not_started' || value === 'in_progress' || value === 'completed') {
      updateStatus(value as CompletionStatus)
    }
  }

  if (isUserLoading || (userId && isInitialLoading)) {
    return (
      <div className="px-2 py-1.5">
        <Skeleton className="h-5 w-full rounded" />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="px-2 py-1.5">
        <Label
          htmlFor={`completion-status-${partId}-disabled`}
          className="text-xs font-medium text-muted-foreground/50 mb-1 block"
        >
          Mark as
        </Label>
        <Select value="not_started" disabled>
          <SelectTrigger
            id={`completion-status-${partId}-disabled`}
            className="w-full h-8 text-xs text-muted-foreground/50"
          >
            <SelectValue placeholder="Select status..." />
          </SelectTrigger>
        </Select>
      </div>
    )
  }

  return (
    <div className="px-2 py-1.5">
      <Label
        htmlFor={`completion-status-${partId}`}
        className="text-xs font-medium text-muted-foreground mb-1 block"
      >
        Mark as
      </Label>
      <Select value={status} onValueChange={handleStatusChange} disabled={isLoading}>
        <SelectTrigger id={`completion-status-${partId}`} className="w-full h-8 text-xs">
          <SelectValue placeholder="Select status..." />
        </SelectTrigger>
        <SelectContent>
          {(['not_started', 'in_progress', 'completed'] as CompletionStatus[]).map((s) => (
            <SelectItem key={s} value={s} className="text-xs">
              {statusLabels[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-red-500 mt-1">Error: {error}</p>}
    </div>
  )
}
