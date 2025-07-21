'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Copy, CheckCheck, X, CheckCircle, XCircle } from 'lucide-react'
import { useState } from 'react'

interface SubmissionDetailProps {
  submissionId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubmissionDetail({ submissionId, open, onOpenChange }: SubmissionDetailProps) {
  const [copied, setCopied] = useState(false)

  // Dans une vraie application, ces données viendraient d'une API
  const submission = {
    id: submissionId,
    status: submissionId === '1' ? 'failed' : 'partial',
    date: new Date(2023, 4, submissionId === '1' ? 15 : 16),
    executionTime: submissionId === '1' ? '123ms' : '98ms',
    memoryUsage: submissionId === '1' ? '15.3MB' : '14.8MB',
    code: `function countMaxOrSubsets(nums: number[]): number {
  // Calculate maximum possible OR value
  let maxOr = 0;
  for (const num of nums) {
    maxOr |= num;
  }
  
  // Use dynamic programming to count subsets
  let count = 0;
  
  // Helper function for backtracking
  const backtrack = (index: number, currentOr: number) => {
    // Base case: we've considered all elements
    if (index === nums.length) {
      if (currentOr === maxOr) {
        count++;
      }
      return;
    }
    
    // Option 1: Include current element
    backtrack(index + 1, currentOr | nums[index]);
    
    // Option 2: Exclude current element
    backtrack(index + 1, currentOr);
  };
  
  backtrack(0, 0);
  return count;
}`,
    testCases: [
      {
        input: '[3,1,2,5]',
        expectedOutput: '6',
        actualOutput: '6',
        passed: true,
      },
      {
        input: '[2,2,2]',
        expectedOutput: '7',
        actualOutput: '7',
        passed: true,
      },
      {
        input: '[3,2,1,5]',
        expectedOutput: '6',
        actualOutput: submissionId === '1' ? '4' : '6',
        passed: submissionId === '1' ? false : true,
      },
      {
        input: '[5,8,12,15]',
        expectedOutput: '5',
        actualOutput: submissionId === '2' ? '3' : '5',
        passed: submissionId === '2' ? false : true,
      },
    ],
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(submission.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const passedTests = submission.testCases.filter((test) => test.passed).length
  const totalTests = submission.testCases.length
  const statusColor =
    submission.status === 'failed'
      ? 'bg-red-500/10 text-red-500 border-red-500/20'
      : submission.status === 'partial'
        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
        : 'bg-green-500/10 text-green-500 border-green-500/20'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-6 pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-xl mb-2">Submission #{submissionId}</DialogTitle>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`rounded-sm ${statusColor}`}>
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {submission.date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {passedTests} of {totalTests} test cases passed
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 px-6 py-2">
            <div className="flex items-center text-sm">
              <span className="text-muted-foreground mr-2">Execution Time:</span>
              <span className="font-medium">{submission.executionTime}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-muted-foreground mr-2">Memory Usage:</span>
              <span className="font-medium">{submission.memoryUsage}</span>
            </div>
          </div>

          <Separator />

          <div className="flex-1 overflow-auto">
            <div className="relative bg-muted p-4 min-h-[200px] overflow-x-auto">
              <div className="flex justify-between items-center mb-2">
                <Badge variant="outline" className="bg-muted">
                  TypeScript
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  onClick={handleCopyCode}
                >
                  {copied ? (
                    <>
                      <CheckCheck className="h-3.5 w-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
              <pre className="text-sm font-mono">{submission.code}</pre>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Test Results</h3>
              <div className="space-y-3">
                {submission.testCases.map((test, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm">Test Case #{index + 1}</h4>
                      <Badge
                        variant="outline"
                        className={
                          test.passed
                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }
                      >
                        {test.passed ? (
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        {test.passed ? 'Passed' : 'Failed'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground mb-1">Input</p>
                        <div className="bg-background p-2 rounded-md font-mono">{test.input}</div>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Expected</p>
                        <div className="bg-background p-2 rounded-md font-mono">
                          {test.expectedOutput}
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Actual</p>
                        <div
                          className={`p-2 rounded-md font-mono ${
                            test.passed ? 'bg-background' : 'bg-red-50'
                          }`}
                        >
                          {test.actualOutput}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Comments</h3>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
