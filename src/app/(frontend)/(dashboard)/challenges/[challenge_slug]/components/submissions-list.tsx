'use client'

import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { useState, useRef, useEffect } from 'react'

type Submission = {
  id: string
  submissionType: 'accepted' | 'runtimeError' | 'wrongAnswer' | 'timeLimitExceeded'
  testsPassed: number
  testsTotal: number
  createdAt: string
  code: {
    language: string
    content: string
  }
}

type SubmissionsListProps = {
  challengeId: number
  userId: string
  initialSubmissions: Submission[]
}

export function SubmissionsList({ challengeId, userId, initialSubmissions }: SubmissionsListProps) {
  const params = useParams()
  const challenge_slug = params.challenge_slug as string
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions)
  const tempSubmissionRef = useRef<{ id: string; submission: Submission } | null>(null)

  // Initialize window functions in useEffect to ensure they're set after mount
  useEffect(() => {
    window.addTempSubmission = (submission: Submission) => {
      tempSubmissionRef.current = { id: submission.id, submission }
      setSubmissions((prev) => [submission, ...prev])
    }

    window.updateSubmission = (tempId: string, serverSubmission: Submission) => {
      if (tempSubmissionRef.current?.id === tempId) {
        tempSubmissionRef.current = null
        setSubmissions((prev) => prev.map((sub) => (sub.id === tempId ? serverSubmission : sub)))
      }
    }

    // Cleanup function to remove window functions when component unmounts
    return () => {
      window.addTempSubmission = null as unknown as undefined
      window.updateSubmission = null as unknown as undefined
    }
  }, []) // Empty dependency array since these functions don't depend on any props/state

  const getStatusBadgeClass = (submission: Submission) => {
    if (submission.testsPassed === submission.testsTotal) {
      return 'bg-green-500/10 text-green-500 border-green-500/20'
    }
    if (submission.testsPassed > 0) {
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    }
    return 'bg-red-500/10 text-red-500 border-red-500/20'
  }

  const formatStatus = (status: string) => {
    const words = status.split(/(?=[A-Z])/)
    return words
      .map((word, index) =>
        index === 0
          ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          : word.toLowerCase(),
      )
      .join(' ')
  }

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false} mode="popLayout">
        {submissions.map((submission) => (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            layout
          >
            <Link
              href={`/challenges/${challenge_slug}/submissions/${submission.id}`}
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
                Submitted on{' '}
                {new Date(submission.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

declare global {
  interface Window {
    addTempSubmission?: (submission: Submission) => void
    updateSubmission?: (tempId: string, serverSubmission: Submission) => void
  }
}
