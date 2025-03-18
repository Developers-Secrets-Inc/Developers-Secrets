'use client'

import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { SubmissionDetail } from './submission-detail'

// Exemples de soumissions pour démonstration
const EXAMPLE_SUBMISSIONS = [
  {
    id: '1',
    status: 'failed',
    date: new Date(2023, 4, 15, 14, 32),
  },
  {
    id: '2',
    status: 'partial',
    date: new Date(2023, 4, 15, 15, 47),
  },
]

export function SubmissionsList() {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null)
  const [submissionDetailOpen, setSubmissionDetailOpen] = useState(false)

  const handleViewSubmission = (id: string) => {
    setSelectedSubmissionId(id)
    setSubmissionDetailOpen(true)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'failed':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'partial':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      case 'success':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-3">
      {EXAMPLE_SUBMISSIONS.map((submission) => (
        <div
          key={submission.id}
          className="border rounded-md p-3 cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={() => handleViewSubmission(submission.id)}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Submission #{submission.id}</span>
            <Badge
              variant="outline"
              className={`rounded-sm ${getStatusBadgeClass(submission.status)}`}
            >
              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Submitted on{' '}
            {submission.date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      ))}

      {selectedSubmissionId && (
        <SubmissionDetail
          submissionId={selectedSubmissionId}
          open={submissionDetailOpen}
          onOpenChange={setSubmissionDetailOpen}
        />
      )}
    </div>
  )
}
