import { Badge } from '@/components/ui/badge'

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-red-500">Runtime Error</h2>
        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
          {testsPassed}/{testsTotal} tests passed
        </Badge>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Error Message</h3>
        <div className="rounded-lg bg-red-500/5 border border-red-500/10 p-4">
          <pre className="text-sm text-red-500 whitespace-pre-wrap">
            <code>{error}</code>
          </pre>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Last Expected Outputs</h3>
        <div className="rounded-lg bg-muted p-4 space-y-2">
          {lastExpectedOutput.map((output, index) => (
            <div key={index} className="text-sm">
              <span className="font-medium">Output {index + 1}:</span> {output.output}
            </div>
          ))}
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
