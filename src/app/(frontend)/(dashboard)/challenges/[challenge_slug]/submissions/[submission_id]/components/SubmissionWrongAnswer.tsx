import { Badge } from '@/components/ui/badge'

type SubmissionWrongAnswerProps = {
  testsPassed: number
  testsTotal: number
  code: {
    language: string
    content: string
  }
  input: string
  output: string
  expectedOutput: string
}

export function SubmissionWrongAnswer({
  testsPassed,
  testsTotal,
  code,
  input,
  output,
  expectedOutput,
}: SubmissionWrongAnswerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-red-500">Wrong Answer</h2>
        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
          {testsPassed}/{testsTotal} tests passed
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Input</h3>
          <div className="rounded-lg bg-muted p-4">
            <pre className="text-sm">
              <code>{input}</code>
            </pre>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Your Output</h3>
            <div className="rounded-lg bg-red-500/5 border border-red-500/10 p-4">
              <pre className="text-sm">
                <code>{output}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Expected Output</h3>
            <div className="rounded-lg bg-green-500/5 border border-green-500/10 p-4">
              <pre className="text-sm">
                <code>{expectedOutput}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Your Code</h3>
        <div className="rounded-lg bg-muted p-4">
          <pre className="text-sm">
            <code>{code.content}</code>
          </pre>
        </div>
        <p className="text-xs text-muted-foreground">Language: {code.language}</p>
      </div>
    </div>
  )
}
