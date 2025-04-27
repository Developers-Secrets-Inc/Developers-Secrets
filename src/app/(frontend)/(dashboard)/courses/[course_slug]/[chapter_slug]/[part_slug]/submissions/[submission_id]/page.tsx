import { notFound } from 'next/navigation'
import { getCoursePartSubmissionById } from '@/core/courses/submissions/actions' // Assume this exists
import { CourseSubmissionAccepted } from './components/CourseSubmissionAccepted'
import { CourseSubmissionRuntimeError } from './components/CourseSubmissionRuntimeError'
import { CourseSubmissionWrongAnswer } from './components/CourseSubmissionWrongAnswer'
import { CourseSubmissionTimeLimitExceeded } from './components/CourseSubmissionTimeLimitExceeded'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function CoursePartSubmissionPage({
  params,
}: {
  // Params will include slugs and the submission ID
  params: Promise<{
    course_slug: string
    chapter_slug: string
    part_slug: string
    submission_id: string
  }>
}) {
  const { submission_id } = await params

  // Fetch the specific submission by ID
  // Note: ID might be number or string depending on your DB/Payload config
  const submission = await getCoursePartSubmissionById(submission_id)

  if (!submission) {
    notFound()
  }

  const renderSubmission = () => {
    // Extract common props, handling potential nullish values
    const commonProps = {
      testsPassed: submission.testsPassed ?? 0,
      testsTotal: submission.testsTotal ?? 0,
      code: submission.code ?? { language: 'unknown', content: '' },
    }

    switch (submission.submissionType) {
      case 'accepted':
        return <CourseSubmissionAccepted {...commonProps} />
      case 'runtimeError':
        return (
          <CourseSubmissionRuntimeError
            {...commonProps}
            error={submission.error ?? 'No error message available'}
            lastExpectedOutput={submission.lastExpectedOutput ?? []}
          />
        )
      case 'wrongAnswer':
        return (
          <CourseSubmissionWrongAnswer
            {...commonProps}
            input={submission.input ?? 'No input available'}
            output={submission.output ?? 'No output available'}
            expectedOutput={submission.expectedOutput ?? 'No expected output available'}
          />
        )
      case 'timeLimitExceeded':
        return (
          <CourseSubmissionTimeLimitExceeded
            {...commonProps}
            lastExpectedOutput={submission.lastExpectedOutput ?? []}
          />
        )
      default:
        return <div>Unknown submission type: {submission.submissionType}</div>
    }
  }

  return (
    // Basic layout similar to challenge submission page
    <div className="min-h-screen">
      <div className="container max-w-5xl py-8">
        {/* Add Back Button */}
        <Link href="." className="inline-block mb-6">
          {' '}
          {/* Link to parent directory */}
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Submissions
          </Button>
        </Link>

        {/* Submission details card */}
        <div className="bg-background rounded-lg shadow-sm border p-6">{renderSubmission()}</div>
      </div>
    </div>
  )
}
