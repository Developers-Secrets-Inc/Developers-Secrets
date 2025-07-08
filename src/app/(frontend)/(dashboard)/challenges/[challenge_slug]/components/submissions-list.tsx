'use client'

import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { NoSubmissions } from '@/core/challenges/submissions/components/no-submissions'
import { useChallengeSubmissions } from '@/core/challenges/submissions/hooks/use-challenge-submissions'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'
import { useQueryState } from 'nuqs'

type Submission = {
  id: number
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
  challenge: {
    id: number
    slug: string
  }
  userId: string
}

const SubmissionCard = ({
  submission,
  challengeSlug,
}: {
  submission: Submission
  challengeSlug: string
}) => {
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
    <motion.div
      key={submission.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <Link
        href={`/challenges/${challengeSlug}/submissions/${submission.id}`}
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
          <Badge variant="outline" className={`rounded-sm ${getStatusBadgeClass(submission)}`}>
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
  )
}

export function SubmissionsList({ challenge }: SubmissionsListProps) {
  const [currentPage, setCurrentPage] = useQueryState('page', {
    defaultValue: 1,
    parse: Number,
    serialize: String,
  })

  const { paginationData, isLoading } = useChallengeSubmissions(challenge.id, currentPage)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  if (!paginationData || paginationData.docs.length === 0) {
    return <NoSubmissions />
  }

  const { docs: submissions, totalPages, page } = paginationData

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false} mode="popLayout">
        {submissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <NoSubmissions />
          </motion.div>
        ) : (
          submissions.map((submission) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              challengeSlug={challenge.slug}
            />
          ))
        )}
      </AnimatePresence>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent className="w-full justify-between">
            <PaginationItem>
              <PaginationLink
                className={cn(
                  'aria-disabled:pointer-events-none aria-disabled:opacity-50',
                  buttonVariants({
                    variant: 'outline',
                  }),
                )}
                onClick={() => setCurrentPage(currentPage - 1)}
                aria-label="Go to previous page"
                aria-disabled={currentPage === 1}
              >
                <ChevronLeftIcon size={16} aria-hidden="true" />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <p className="text-muted-foreground text-sm" aria-live="polite">
                Page <span className="text-foreground">{page}</span> of{' '}
                <span className="text-foreground">{totalPages}</span>
              </p>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                className={cn(
                  'aria-disabled:pointer-events-none aria-disabled:opacity-50',
                  buttonVariants({
                    variant: 'outline',
                  }),
                )}
                onClick={() => setCurrentPage(currentPage + 1)}
                aria-label="Go to next page"
                aria-disabled={currentPage === totalPages}
              >
                <ChevronRightIcon size={16} aria-hidden="true" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
