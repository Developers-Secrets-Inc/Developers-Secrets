import { Badge } from '@/components/ui/badge'
import { CodeBlock, CodeBlockCode, CodeBlockGroup } from '@/components/code-block'
import { CheckCircle2Icon } from 'lucide-react'
import { CoursePartSubmission } from '@/payload-types' // Use CoursePartSubmission type

// Type for the props expected by this component
type CourseSubmissionAcceptedProps = Pick<
  CoursePartSubmission,
  'testsPassed' | 'testsTotal' | 'code'
>

export function CourseSubmissionAccepted({
  testsPassed,
  testsTotal,
  code,
}: CourseSubmissionAcceptedProps) {
  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-row items-center justify-between space-y-0 pb-4 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2Icon className="h-6 w-6 text-emerald-500" />
            <h2 className="text-2xl font-semibold text-emerald-500">Solution Accepted</h2>
          </div>
          <p className="text-sm text-muted-foreground">Your solution has passed all test cases</p>
        </div>
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1"
        >
          {testsPassed}/{testsTotal} tests passed
        </Badge>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {/* <h3 className="text-lg font-medium">Your Solution</h3> Removed based on new style */}
          <span className="text-sm text-muted-foreground">Language: {code?.language || 'N/A'}</span>
        </div>

        <CodeBlock>
          <CodeBlockGroup>
            <span>Solution Code</span>
            <span className="text-emerald-500">✓ Accepted</span>
          </CodeBlockGroup>
          <CodeBlockCode code={code?.content || ''} language={code?.language || 'plaintext'} />
        </CodeBlock>
      </div>
    </div>
  )
}
