import { Badge } from '@/components/ui/badge'
import { CodeBlock, CodeBlockCode, CodeBlockGroup } from '@/components/code-block'
import { Clock } from 'lucide-react'
import { CoursePartSubmission } from '@/payload-types'

// Props based on CoursePartSubmission
type CourseSubmissionTimeLimitExceededProps = Pick<
  CoursePartSubmission,
  'testsPassed' | 'testsTotal' | 'code' | 'lastExpectedOutput'
>

export function CourseSubmissionTimeLimitExceeded({
  testsPassed,
  testsTotal,
  code,
  lastExpectedOutput,
}: CourseSubmissionTimeLimitExceededProps) {
  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-row items-center justify-between space-y-0 pb-4 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-amber-500" />
            <h2 className="text-2xl font-semibold text-amber-500">Time Limit Exceeded</h2>
          </div>
          <p className="text-sm text-muted-foreground">Your solution took too long to execute</p>
        </div>
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1"
        >
          {testsPassed}/{testsTotal} tests passed
        </Badge>
      </div>

      {/* Main Content */}
      {/* Last Expected Output Section */}
      {lastExpectedOutput && lastExpectedOutput.length > 0 && (
        <div className="space-y-4">
          <CodeBlock>
            <CodeBlockGroup>
              <span>Expected Output</span>
            </CodeBlockGroup>
            <CodeBlockCode code={lastExpectedOutput[0]?.output || 'N/A'} language="plaintext" />
          </CodeBlock>
        </div>
      )}

      {/* Your Code Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Your Code</h3>
          <span className="text-sm text-muted-foreground">Language: {code?.language || 'N/A'}</span>
        </div>
        <CodeBlock>
          <CodeBlockGroup>
            <span>Solution Code</span>
            <span className="text-amber-500">⏱ Time Limit Exceeded</span>
          </CodeBlockGroup>
          <CodeBlockCode code={code?.content || ''} language={code?.language || 'plaintext'} />
        </CodeBlock>
      </div>
    </div>
  )
}
