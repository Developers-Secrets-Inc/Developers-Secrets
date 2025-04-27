import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CodeBlock, CodeBlockCode, CodeBlockGroup } from '@/components/code-block'
import { AlertTriangle } from 'lucide-react'
import { CoursePartSubmission } from '@/payload-types'

// Props based on CoursePartSubmission
type CourseSubmissionRuntimeErrorProps = Pick<
  CoursePartSubmission,
  'testsPassed' | 'testsTotal' | 'code' | 'error' | 'lastExpectedOutput'
>

export function CourseSubmissionRuntimeError({
  testsPassed,
  testsTotal,
  code,
  error,
  lastExpectedOutput,
}: CourseSubmissionRuntimeErrorProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-semibold text-red-500">Runtime Error</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Your code encountered an error during execution
          </p>
        </div>
        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 px-3 py-1">
          {testsPassed}/{testsTotal} tests passed
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Error Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Error Details</h3>
          <CodeBlock>
            <CodeBlockGroup>
              <span>Error Message</span>
            </CodeBlockGroup>
            <CodeBlockCode
              code={error || 'No error message'}
              language="plaintext"
              className="text-red-500"
            />
          </CodeBlock>
        </div>

        {/* Last Expected Output Section - Check if exists */}
        {lastExpectedOutput && lastExpectedOutput.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Input That Caused Error's Expected Output</h3>
            {/* CoursePartSubmission stores lastExpectedOutput differently */}
            {/* It's an array, potentially with multiple items, but usually just one */}
            <CodeBlock>
              <CodeBlockGroup>
                <span>Expected Output</span>
              </CodeBlockGroup>
              <CodeBlockCode code={lastExpectedOutput[0]?.output || 'N/A'} language="plaintext" />
            </CodeBlock>
            {/* Optional: Display input if available from the payload type */}
            {/* {submission.input && ...} */}
          </div>
        )}

        {/* Your Code Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Your Code</h3>
            <span className="text-sm text-muted-foreground">
              Language: {code?.language || 'N/A'}
            </span>
          </div>
          <CodeBlock>
            <CodeBlockGroup>
              <span>Solution Code</span>
              <span className="text-red-500">⚠ Runtime Error</span>
            </CodeBlockGroup>
            <CodeBlockCode code={code?.content || ''} language={code?.language || 'plaintext'} />
          </CodeBlock>
        </div>
      </CardContent>
    </Card>
  )
}
