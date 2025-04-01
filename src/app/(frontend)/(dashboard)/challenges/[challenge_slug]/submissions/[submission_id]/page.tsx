import { getSubmission } from '@/core/challenges/submissions'
import { SubmissionAccepted } from './components/SubmissionAccepted'
import { SubmissionRuntimeError } from './components/SubmissionRuntimeError'
import { SubmissionWrongAnswer } from './components/SubmissionWrongAnswer'
import { SubmissionTimeLimitExceeded } from './components/SubmissionTimeLimitExceeded'

export default async function SubmissionPage({
  params,
}: {
  params: Promise<{ challenge_slug: string; submission_id: string }>
}) {
  const { submission_id } = await params
  const submission = await getSubmission(Number(submission_id))

  const renderSubmission = () => {
    switch (submission.submissionType) {
      case 'accepted':
        return (
          <SubmissionAccepted
            testsPassed={submission.testsPassed}
            testsTotal={submission.testsTotal}
            code={submission.code}
          />
        )
      case 'runtimeError':
        return (
          <SubmissionRuntimeError
            testsPassed={submission.testsPassed}
            testsTotal={submission.testsTotal}
            code={submission.code}
            error={submission.error}
            lastExpectedOutput={submission.lastExpectedOutput}
          />
        )
      case 'wrongAnswer':
        return (
          <SubmissionWrongAnswer
            testsPassed={submission.testsPassed}
            testsTotal={submission.testsTotal}
            code={submission.code}
            input={submission.input}
            output={submission.output}
            expectedOutput={submission.expectedOutput}
          />
        )
      case 'timeLimitExceeded':
        return (
          <SubmissionTimeLimitExceeded
            testsPassed={submission.testsPassed}
            testsTotal={submission.testsTotal}
            code={submission.code}
            lastExpectedOutput={submission.lastExpectedOutput}
          />
        )
      default:
        return <div>Unknown submission type</div>
    }
  }

  return <div className="container max-w-5xl py-6">{renderSubmission()}</div>
}
