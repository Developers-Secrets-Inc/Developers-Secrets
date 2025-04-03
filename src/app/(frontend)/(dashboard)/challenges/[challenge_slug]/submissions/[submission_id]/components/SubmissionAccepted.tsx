import { Badge } from '@/components/ui/badge'
import { CodeBlock, CodeBlockCode, CodeBlockGroup } from '@/components/code-block'

type SubmissionAcceptedProps = {
  testsPassed: number
  testsTotal: number
  code: {
    language: string
    content: string
  }
}

export function SubmissionAccepted({ testsPassed, testsTotal, code }: SubmissionAcceptedProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Solution Accepted</h2>
          <p className="text-sm text-muted-foreground">Your solution has passed all test cases</p>
        </div>
        <Badge
          variant="outline"
          className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1"
        >
          {testsPassed}/{testsTotal} tests passed
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Your Solution</h3>
          <span className="text-sm text-muted-foreground">Language: {code.language}</span>
        </div>

        <CodeBlock>
          <CodeBlockGroup>
            <span>Solution Code</span>
            <span className="text-green-500">✓ Accepted</span>
          </CodeBlockGroup>
          <CodeBlockCode code={code.content} language={code.language} />
        </CodeBlock>
      </div>
    </div>
  )
}
