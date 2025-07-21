'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import {
  useCoursePartSubmissions,
  CoursePartSubmission,
} from '@/core/courses/submissions/hooks/useCoursePartSubmissions'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { NoSubmissions } from '@/core/challenges/submissions/components/no-submissions'

type CourseSubmissionsListProps = {
  partId: number
  userId: string
  initialSubmissions: CoursePartSubmission[]
}

const formatStatus = (status: string) => {
  if (!status) return 'Unknown'
  const words = status.split(/(?=[A-Z])/)
  return words
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase(),
    )
    .join(' ')
}

const getStatusBadgeClass = (submission: CoursePartSubmission) => {
  if (submission.testsTotal > 0 && submission.testsPassed === submission.testsTotal) {
    return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  }
  if (submission.testsPassed > 0) {
    return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
  }
  return 'bg-red-500/10 text-red-500 border-red-500/20'
}

export function CourseSubmissionsList({
  partId,
  userId,
  initialSubmissions,
}: CourseSubmissionsListProps) {
  const params = useParams()
  const [submissions, setSubmissions] = useState<CoursePartSubmission[]>(initialSubmissions)
  const tempSubmissionRef = useRef<{ id: string; submission: CoursePartSubmission } | null>(null)

  const { isLoading } = useCoursePartSubmissions(partId, userId, initialSubmissions)

  useEffect(() => {
    window.addTempCourseSubmission = (submission: CoursePartSubmission) => {
      tempSubmissionRef.current = { id: submission.id, submission }
      setSubmissions((prev) => [submission, ...prev])
    }

    window.updateCourseSubmission = (tempId: string, serverSubmission: CoursePartSubmission) => {
      if (tempSubmissionRef.current?.id === tempId) {
        tempSubmissionRef.current = null
        setSubmissions((prev) => prev.map((sub) => (sub.id === tempId ? serverSubmission : sub)))
      }
    }

    return () => {
      window.addTempCourseSubmission = undefined
      window.updateCourseSubmission = undefined
    }
  }, [])

  const displaySubmissions = submissions

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false} mode="popLayout">
        {isLoading && displaySubmissions.length === 0 ? (
          <div>Loading...</div>
        ) : displaySubmissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <NoSubmissions />
          </motion.div>
        ) : (
          displaySubmissions.map((submission: CoursePartSubmission) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <Link
                href={`./submissions/${submission.id}`}
                className="block border rounded-md p-3 cursor-pointer hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <motion.span
                    className="text-sm font-medium"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {formatStatus(submission.submissionType)}
                  </motion.span>
                  <Badge
                    variant="outline"
                    className={`rounded-sm ${getStatusBadgeClass(submission)}`}
                  >
                    {submission.testsPassed}/{submission.testsTotal} tests
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Submitted{' '}
                  {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                </p>
              </Link>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  )
}

declare global {
  interface Window {
    addTempCourseSubmission?: (submission: CoursePartSubmission) => void
    updateCourseSubmission?: (tempId: string, serverSubmission: CoursePartSubmission) => void
  }
}
