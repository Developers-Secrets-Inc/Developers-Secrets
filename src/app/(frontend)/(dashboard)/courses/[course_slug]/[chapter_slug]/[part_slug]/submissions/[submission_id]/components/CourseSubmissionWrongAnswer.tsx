import { Badge } from '@/components/ui/badge'
import { CodeBlock, CodeBlockCode, CodeBlockGroup } from '@/components/code-block'
import { XCircle } from 'lucide-react'
import { CoursePartSubmission } from '@/payload-types'

// Props based on CoursePartSubmission
type CourseSubmissionWrongAnswerProps = Pick<
  CoursePartSubmission,
  'testsPassed' | 'testsTotal' | 'code' | 'input' | 'output' | 'expectedOutput'
>

export function CourseSubmissionWrongAnswer({
  testsPassed,
  testsTotal,
  code,
  input,
  output,
  expectedOutput,
}: CourseSubmissionWrongAnswerProps) {
  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-row items-center justify-between space-y-0 pb-4 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <XCircle className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-semibold text-red-500">Wrong Answer</h2>
          </div>
          <p className="text-sm text-muted-foreground">Your solution produced incorrect output</p>
        </div>
        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 px-3 py-1">
          {testsPassed}/{testsTotal} tests passed
        </Badge>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <CodeBlock>
            <CodeBlockGroup>
              <span>Input</span>
            </CodeBlockGroup>
            <CodeBlockCode code={input || 'N/A'} language="plaintext" />
          </CodeBlock>
        </div>

        {/* Outputs Section */}
        <div className="space-y-4">
          <CodeBlock>
            <CodeBlockGroup>
              <span>Your Output</span>
              <span className="text-red-500">✗ Wrong</span>
            </CodeBlockGroup>
            <CodeBlockCode code={output || 'N/A'} language="plaintext" />
          </CodeBlock>

          <CodeBlock>
            <CodeBlockGroup>
              <span>Expected Output</span>
              <span className="text-emerald-500">✓ Correct</span>
            </CodeBlockGroup>
            <CodeBlockCode code={expectedOutput || 'N/A'} language="plaintext" />
          </CodeBlock>
        </div>
      </div>

      {/* Your Code Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Your Code</h3>
          <span className="text-sm text-muted-foreground">Language: {code?.language || 'N/A'}</span>
        </div>
        <CodeBlock>
          <CodeBlockGroup>
            <span>Solution Code</span>
            <span className="text-red-500">✗ Wrong Answer</span>
          </CodeBlockGroup>
          <CodeBlockCode code={code?.content || ''} language={code?.language || 'plaintext'} />
        </CodeBlock>
      </div>
    </div>
  )
}
