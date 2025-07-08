import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CodeBlock, CodeBlockCode, CodeBlockGroup } from '@/components/code-block'
import { ArrowLeft, XCircle } from 'lucide-react'
import Link from 'next/link'

type SubmissionWrongAnswerProps = {
  challengeSlug: string
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
  challengeSlug,
  testsPassed,
  testsTotal,
  code,
  input,
  output,
  expectedOutput,
}: SubmissionWrongAnswerProps) {
  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
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

      <div className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Test Case</h3>
            </div>
            <CodeBlock>
              <CodeBlockGroup>
                <span>Input</span>
              </CodeBlockGroup>
              <CodeBlockCode code={input} language="plaintext" />
            </CodeBlock>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Results</h3>
              <div className="space-y-4">
                <CodeBlock>
                  <CodeBlockGroup>
                    <span>Your Output</span>
                    <span className="text-red-500">✗ Wrong</span>
                  </CodeBlockGroup>
                  <CodeBlockCode code={output} language="plaintext" />
                </CodeBlock>

                <CodeBlock>
                  <CodeBlockGroup>
                    <span>Expected Output</span>
                    <span className="text-emerald-500">✓ Correct</span>
                  </CodeBlockGroup>
                  <CodeBlockCode code={expectedOutput} language="plaintext" />
                </CodeBlock>
              </div>
            </div>
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
              <span className="text-red-500">✗ Wrong Answer</span>
            </CodeBlockGroup>
            <CodeBlockCode code={code.content} language={code.language} />
          </CodeBlock>
        </div>
      </div>
    </div>
  )
}
