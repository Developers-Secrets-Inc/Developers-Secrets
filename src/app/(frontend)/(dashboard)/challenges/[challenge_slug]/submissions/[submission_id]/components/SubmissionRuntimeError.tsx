import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CodeBlock, CodeBlockCode, CodeBlockGroup } from '@/components/code-block'
import { AlertTriangle } from 'lucide-react'

type SubmissionRuntimeErrorProps = {
  testsPassed: number
  testsTotal: number
  code: {
    language: string
    content: string
  }
  error: string
  lastExpectedOutput: { output: string }[]
}

export function SubmissionRuntimeError({
  testsPassed,
  testsTotal,
  code,
  error,
  lastExpectedOutput,
}: SubmissionRuntimeErrorProps) {
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Error Details</h3>
          </div>
          <CodeBlock>
            <CodeBlockGroup>
              <span>Error Message</span>
            </CodeBlockGroup>
            <CodeBlockCode code={error} language="plaintext" className="text-red-500" />
          </CodeBlock>
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
                <CodeBlockCode code={output.output} language="plaintext" />
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
              <span className="text-red-500">⚠ Runtime Error</span>
            </CodeBlockGroup>
            <CodeBlockCode code={code.content} language={code.language} />
          </CodeBlock>
        </div>
      </CardContent>
    </Card>
  )
}
