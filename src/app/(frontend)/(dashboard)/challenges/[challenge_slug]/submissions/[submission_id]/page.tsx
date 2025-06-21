import { getSubmission } from '@/core/challenges/submissions'
import { SubmissionAccepted } from './components/SubmissionAccepted'
import { SubmissionRuntimeError } from './components/SubmissionRuntimeError'
import { SubmissionWrongAnswer } from './components/SubmissionWrongAnswer'
import { SubmissionTimeLimitExceeded } from './components/SubmissionTimeLimitExceeded'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function SubmissionPage({
  params,
}: {
  params: Promise<{ challenge_slug: string; submission_id: string }>
}) {
  const { challenge_slug, submission_id } = await params
  const submission = await getSubmission(Number(submission_id))

  if (!submission) {
    notFound()
  }

  const renderSubmission = () => {
    const commonProps = {
      testsPassed: submission.testsPassed,
      testsTotal: submission.testsTotal,
      code: submission.code,
      challengeSlug: challenge_slug,
    }

    switch (submission.submissionType) {
      case 'accepted':
        return <SubmissionAccepted {...commonProps} />
      case 'runtimeError':
        return (
          <SubmissionRuntimeError
            {...commonProps}
            error={submission.error || 'No error message available'}
            lastExpectedOutput={
              submission.lastExpectedOutput?.map((output) => ({
                output: output.output || '',
              })) || []
            }
          />
        )
      case 'wrongAnswer':
        return (
          <SubmissionWrongAnswer
            {...commonProps}
            input={submission.input || 'No input available'}
            output={submission.output || 'No output available'}
            expectedOutput={submission.expectedOutput || 'No expected output available'}
            challengeSlug={challenge_slug}
          />
        )
      case 'timeLimitExceeded':
        return (
          <SubmissionTimeLimitExceeded
            {...commonProps}
            lastExpectedOutput={
              submission.lastExpectedOutput?.map((output) => ({
                output: output.output || '',
              })) || []
            }
          />
        )
      default:
        return <div>Unknown submission type</div>
    }
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between py-2 border-b px-4">
        <Button variant="ghost" size="sm" className="gap-1.5" asChild>
          <Link href={`/challenges/${challenge_slug}/submissions`} prefetch={true}>
            <ArrowLeft className="h-4 w-4" />
            Back to submissions
          </Link>
        </Button>
      </div>
      <div className="container max-w-5xl py-8">
        <div className="p-6">{renderSubmission()}</div>
      </div>
    </div>
  )
}
