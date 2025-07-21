'use client'

import React from 'react'
import {
  useCoursePartCompletionStatus,
  CompletionStatus,
} from '@/core/courses/hooks/use-course-part-completion-status'
import { CheckCircle, Circle, CircleDot, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useSessionUser } from '@/core/user/hooks/use-user'

type CompletionStatusLabel = 'Completed' | 'In Progress' | 'Not Started'

type StatusInformations = {
  icon: React.ElementType
  color: string
  label: CompletionStatusLabel
}

const statusConfig: Record<CompletionStatus, StatusInformations> = {
  completed: {
    icon: CheckCircle,
    color: 'text-green-500',
    label: 'Completed',
  },
  in_progress: {
    icon: CircleDot,
    color: 'text-amber-500',
    label: 'In Progress',
  },
  not_started: {
    icon: Circle,
    color: 'text-muted-foreground',
    label: 'Not Started',
  },
}

interface CoursePartStatusClientProps {
  partId: number
  initialStatus?: 'not_started' | 'in_progress' | 'completed'
}

export const CoursePartStatusClient = ({ partId, initialStatus }: CoursePartStatusClientProps) => {
  const { user, isLoading: isUserLoading } = useSessionUser()
  const userId = user?.id

  // Utilisation de initialStatus passé en props, avec 'not_started' par défaut
  const {
    status = initialStatus ?? 'not_started',
    isInitialLoading,
    isLoading,
    error,
  } = useCoursePartCompletionStatus({
    partId,
    userId: userId ?? '',
    initialStatus: initialStatus ?? 'not_started',
    enabled: !!userId,
  })

  const finalStatus = !userId ? 'not_started' : status
  const config = statusConfig[finalStatus]
  const StatusIcon = config.icon

  const IS_LOADING = isUserLoading || isInitialLoading
  if (IS_LOADING) {
    return <Skeleton className="h-5 w-28 rounded" />
  }

  return (
    <PartStatus.Container className={`${config.color}`}>
      <IsLoading isLoading={isLoading} fallback={<Loader2 size={16} className="animate-spin" />}>
        <StatusIcon size={16} aria-hidden="true" />
      </IsLoading>
      <PartStatus.Label value={config.label} />
      {error && <PartStatus.Error value={error} />}
    </PartStatus.Container>
  )
}

type PartStatusContainerProps = React.ComponentProps<'div'> & { className?: string }

const PartStatusContainer = ({ children, className, ...props }: PartStatusContainerProps) => {
  return (
    <div className={cn('flex items-center gap-1.5', className)} {...props}>
      {children}
    </div>
  )
}

const PartStatusLabel = ({ value }: { value: string }) => {
  return <span className="text-sm font-medium">{value}</span>
}

const PartStatusError = ({ value }: { value: string }) => {
  return <span className="text-xs text-red-500 ml-2">({value})</span>
}

const PartStatus = {
  Container: PartStatusContainer,
  Label: PartStatusLabel,
  Error: PartStatusError,
}

const IsLoading = ({
  isLoading,
  fallback,
  children,
}: {
  isLoading: boolean
  fallback: React.ReactNode
  children: React.ReactNode
}) => {
  if (isLoading) {
    return fallback
  }
  return children
}
