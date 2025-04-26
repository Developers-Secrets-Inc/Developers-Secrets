'use client'

import React from 'react'
import {
  useCoursePartCompletionStatus,
  CompletionStatus,
} from '@/core/courses/hooks/use-course-part-completion-status' // Ajuste le chemin
import { CheckCircle, Circle, CircleDot, Loader2 } from 'lucide-react' // Ajout de Loader2
import { cn } from '@/lib/utils' // Assumant que cn existe

const statusConfig: Record<
  CompletionStatus,
  { icon: React.ElementType; color: string; label: string } // Utiliser React.ElementType
> = {
  completed: {
    icon: CheckCircle,
    color: 'text-green-500', // Classes Tailwind
    label: 'Completed',
  },
  in_progress: {
    icon: CircleDot,
    color: 'text-amber-500', // Classes Tailwind
    label: 'In Progress',
  },
  not_started: {
    icon: Circle,
    color: 'text-muted-foreground', // Classes Tailwind
    label: 'Not Started',
  },
}

interface CoursePartStatusClientProps {
  partId: number
  userId: string
  initialStatus: CompletionStatus
}

export const CoursePartStatusClient = ({
  partId,
  userId,
  initialStatus,
}: CoursePartStatusClientProps) => {
  const { status, isLoading, error } = useCoursePartCompletionStatus({
    partId,
    userId,
    initialStatus,
  })

  // Utiliser le statut venant du hook
  const config = statusConfig[status]
  const IconComponent = config.icon // Obtenir le composant icône

  return (
    <div className={cn('flex items-center gap-1.5', config.color)}>
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" /> // Afficher un spinner pendant la mutation
      ) : (
        <IconComponent size={16} aria-hidden="true" />
      )}
      <span className="text-sm font-medium">{config.label}</span>
      {/* Afficher l'erreur si besoin */}
      {error && <span className="text-xs text-red-500 ml-2">({error})</span>}
      {/* Plus tard, ajouter un bouton pour appeler updateStatus() */}
    </div>
  )
}
