'use client'

import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type Submission = {
  id: string
  submissionType: 'accepted' | 'runtimeError' | 'wrongAnswer' | 'timeLimitExceeded'
  testsPassed: number
  testsTotal: number
  createdAt: string
}

type SubmissionsListProps = {
  submissions: Submission[]
}

export function SubmissionsList({ submissions }: SubmissionsListProps) {
  const params = useParams()
  const challenge_slug = params.challenge_slug as string

  const getStatusBadgeClass = (submission: Submission) => {
    // Si tous les tests sont passés
    if (submission.testsPassed === submission.testsTotal) {
      return 'bg-green-500/10 text-green-500 border-green-500/20'
    }
    // Si certains tests sont passés mais pas tous
    if (submission.testsPassed > 0) {
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    }
    // Si aucun test n'est passé
    return 'bg-red-500/10 text-red-500 border-red-500/20'
  }

  const formatStatus = (status: string) => {
    // Split on capital letters and join with space
    const words = status.split(/(?=[A-Z])/)
    // Capitalize only the first letter of the first word
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
      {submissions.map((submission) => (
        <Link
          key={submission.id}
          href={`/challenges/${challenge_slug}/submissions/${submission.id}`}
          className="block border rounded-md p-3 cursor-pointer hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">{formatStatus(submission.submissionType)}</span>
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
      ))}
    </div>
  )
}
