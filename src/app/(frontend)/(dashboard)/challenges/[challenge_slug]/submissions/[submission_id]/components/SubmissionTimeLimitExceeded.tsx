import { Badge } from '@/components/ui/badge'
import { CodeBlock, CodeBlockCode, CodeBlockGroup } from '@/components/code-block'
import { Clock } from 'lucide-react'

type SubmissionTimeLimitExceededProps = {
  testsPassed: number
  testsTotal: number
  code: {
    language: string
    content: string
  }
  lastExpectedOutput: { output: string }[]
}

export function SubmissionTimeLimitExceeded({
  testsPassed,
  testsTotal,
  code,
  lastExpectedOutput,
}: SubmissionTimeLimitExceededProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-amber-500" />
            <h2 className="text-2xl font-semibold text-amber-500">Time Limit Exceeded</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Your solution took too long to execute
          </p>
        </div>
        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1">
          {testsPassed}/{testsTotal} tests passed
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Last Expected Outputs</h3>
        </div>
        <div className="grid gap-4">
          {lastExpectedOutput.map((output, index) => (
            <CodeBlock key={index}>
              <CodeBlockGroup>
                <span>Output {index + 1}</span>
              </CodeBlockGroup>
              <CodeBlockCode
                code={output.output}
                language="plaintext"
              />
            </CodeBlock>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Your Code</h3>
          <span className="text-sm text-muted-foreground">Language: {code.language}</span>
        </div>
        <CodeBlock>
          <CodeBlockGroup>
            <span>Solution Code</span>
            <span className="text-amber-500">⏱ Time Limit Exceeded</span>
          </CodeBlockGroup>
          <CodeBlockCode
            code={code.content}
            language={code.language}
          />
        </CodeBlock>
      </div>
    </div>
  )
}
