import { Badge } from '@/components/ui/badge'

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Solution Accepted</h2>
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
          {testsPassed}/{testsTotal} tests passed
        </Badge>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Your Solution</h3>
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
