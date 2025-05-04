import { getSubmission } from '@/core/challenges/submissions'
import { SubmissionAccepted } from './components/SubmissionAccepted'
import { SubmissionRuntimeError } from './components/SubmissionRuntimeError'
import { SubmissionWrongAnswer } from './components/SubmissionWrongAnswer'
import { SubmissionTimeLimitExceeded } from './components/SubmissionTimeLimitExceeded'
import { notFound } from 'next/navigation'

export default async function SubmissionPage({
  params,
}: {
  params: Promise<{ challenge_slug: string; submission_id: string }>
}) {
  const { submission_id } = await params
  const submission = await getSubmission(Number(submission_id))

  if (!submission) {
    notFound()
  }

  const renderSubmission = () => {
    const commonProps = {
      testsPassed: submission.testsPassed,
      testsTotal: submission.testsTotal,
      code: submission.code,
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
      <div className="container max-w-5xl py-8">
        <div className="p-6">{renderSubmission()}</div>
      </div>
    </div>
  )
}
