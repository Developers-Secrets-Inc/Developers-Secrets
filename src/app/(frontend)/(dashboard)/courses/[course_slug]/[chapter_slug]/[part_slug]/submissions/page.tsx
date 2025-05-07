import { getUser } from '@/core/user'
import { getCoursePartSubmissions } from '@/core/courses/submissions/actions'
import { getPartBySlug } from '@/core/courses/parts' // Correct import path
import { CourseSubmissionsList } from './components/CourseSubmissionsList' // Assume this client component exists
import { notFound, redirect } from 'next/navigation'

export default async function CoursePartSubmissionsPage({
  params,
}: {
  params: Promise<{
    course_slug: string
    chapter_slug: string
    part_slug: string
  }>
}) {
  const { course_slug, chapter_slug, part_slug } = await params

  // Fetch User
  const user = await getUser()
  if (!user) {
    // Redirect to login or show an error/message
    redirect('/login?origin=/courses/' + course_slug) // Example redirect
  }

  // Fetch Course Part (needed for context, e.g., title)
  const coursePart = await getPartBySlug(course_slug, chapter_slug, part_slug)
  if (!coursePart) {
    notFound()
  }

  // Fetch initial submissions data - include code field for the list component
  const submissionsData = await getCoursePartSubmissions(coursePart.id, user.id)

  const initialSubmissions = submissionsData.map((submission) => ({
    id: submission.id.toString(), // Ensure ID is string for the hook
    submissionType: submission.submissionType,
    testsPassed: submission.testsPassed,
    testsTotal: submission.testsTotal,
    createdAt: submission.createdAt,
    // IMPORTANT: Include the code object needed by the hook/list component
    code: submission.code,
    // Include other fields if the list component needs them
    error: submission.error,
    input: submission.input,
    output: submission.output,
    expectedOutput: submission.expectedOutput,
    lastExpectedOutput: submission.lastExpectedOutput,
  }))

  return (
    <div className="py-4 px-6">
      {/* Add context like part title if needed */}
      {/* <h1>Submissions for: {coursePart.name}</h1> */}
      <h3 className="text-lg font-semibold mb-3">Your Submissions</h3>
      <CourseSubmissionsList
        partId={coursePart.id}
        userId={user.id}
        initialSubmissions={initialSubmissions}
      />
    </div>
  )
}
