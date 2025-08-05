'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { useAiEvaluationStore } from '@/api/exercices/ai/store/ai-evaluation-store'

const TERMINAL_STYLE = {
  backgroundColor: '#1a1b26',
  color: '#ffffff',
  fontFamily: 'monospace',
  height: '100%',
  overflow: 'auto',
  whiteSpace: 'pre-wrap' as const,
}

type TestResult = {
  success: boolean
  input: string
  expectedOutput: string
  actualOutput: string
  error?: string
}

type TestCaseDisplayProps = {
  testResult: TestResult
  index: number
}

const TestCaseDisplay = ({ testResult, index }: TestCaseDisplayProps) => (
  <div className="space-y-4 p-2">
    <div
      className={cn(
        'flex items-center justify-between text-sm font-medium',
        testResult.success ? 'text-green-500' : 'text-red-500',
      )}
    >
      <span>
        Test Case #{index + 1}: {testResult.success ? 'Passed' : 'Failed'}
      </span>
      {testResult.success ? (
        <CheckCircle size={16} className="text-green-500" />
      ) : (
        <XCircle size={16} className="text-red-500" />
      )}
    </div>

    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Input</h3>
        <pre className="p-2 rounded bg-muted/50 text-xs">{testResult.input}</pre>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Expected Output</h3>
        <pre className="p-2 rounded bg-muted/50 text-xs">{testResult.expectedOutput}</pre>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Actual Output</h3>
        <pre
          className={cn(
            'p-2 rounded text-xs',
            testResult.success ? 'bg-green-500/10' : 'bg-red-500/10',
          )}
        >
          {testResult.actualOutput}
        </pre>
      </div>
      {testResult.error && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Error</h3>
          <pre className="p-2 rounded bg-red-500/10 text-xs">{testResult.error}</pre>
        </div>
      )}
    </div>
  </div>
)



type EvaluationResult = {
  category: string;
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}

type AiEvaluationDisplayProps = {
  evaluation: EvaluationResult
  index: number
}

const CategoryBadge = ({ category }: { category: string }) => {
  const styles = {
    'excellent': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'good': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'average': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'needs_improvement': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    'poor': 'bg-red-500/10 text-red-500 border-red-500/20',
  }[category] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${styles}`}>
      {category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
    </span>
  )
}

const ScoreBadge = ({ score }: { score: number }) => {
  const getScoreStyle = (score: number) => {
    if (score >= 8) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    if (score >= 6) return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    return 'bg-red-500/10 text-red-500 border-red-500/20'
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getScoreStyle(score)}`}>
      {score}/10
    </span>
  )
}

const AiEvaluationDisplay = ({ evaluation, index }: AiEvaluationDisplayProps) => (
  <div className="space-y-4 p-2">
    <div className="flex items-center justify-between text-sm font-medium">
      <span className="text-muted-foreground">AI Evaluation #{index + 1}</span>
      <div className="flex items-center gap-2">
        <CategoryBadge category={evaluation.category} />
        <ScoreBadge score={evaluation.score} />
      </div>
    </div>

    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Strengths</h3>
        <ul className="list-disc list-inside p-2 rounded bg-muted/50 text-xs">
          {evaluation.strengths.map((strength, i) => (
            <li key={i}>{strength}</li>
          ))}
        </ul>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Improvements</h3>
        <ul className="list-disc list-inside p-2 rounded bg-muted/50 text-xs">
          {evaluation.improvements.map((improvement, i) => (
            <li key={i}>{improvement}</li>
          ))}
        </ul>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Suggestions</h3>
        <ul className="list-disc list-inside p-2 rounded bg-muted/50 text-xs">
          {evaluation.suggestions.map((suggestion, i) => (
            <li key={i}>{suggestion}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)

export const AITestResults = () => {
  const { submissionResult, testResults, aiEvaluation, isCompiling, isEvaluating } = useAiEvaluationStore()

  if (isCompiling) {
    return (
      <div style={TERMINAL_STYLE} className="flex items-center justify-center">
        <Loader2 size={24} className="animate-spin mr-2" /> Compiling code...
      </div>
    )
  }

  if (isEvaluating) {
    return (
      <div style={TERMINAL_STYLE} className="flex items-center justify-center">
        <Loader2 size={24} className="animate-spin mr-2" /> Evaluating AI results...
      </div>
    )
  }

  if (aiEvaluation && aiEvaluation.length > 0) {
    return (
      <div className="h-full overflow-auto">
        <Tabs defaultValue="0" className="h-full">
          <div className="border-b">
            <TabsList className="bg-background h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse">
              {aiEvaluation.map((_, index) => (
                <TabsTrigger
                  key={index}
                  value={index.toString()}
                  className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5"
                >
                  AI Eval {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {aiEvaluation.map((evaluation, index) => (
            <TabsContent key={index} value={index.toString()}>
              <AiEvaluationDisplay evaluation={evaluation} index={index} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    )
  }

  if (!submissionResult && !testResults && !aiEvaluation) {
    return (
      <div style={TERMINAL_STYLE} className="flex items-center justify-center">
        <Loader2 size={24} className="animate-spin mr-2" /> Loading test results...
      </div>
    )
  }

  if (!submissionResult && !testResults) {
    return (
      <div
        className="flex items-center justify-center text-muted-foreground"
        style={{ height: 'calc(100% - 24px)' }}
      >
        {'No test results available. Submit your code to see the results.'}
      </div>
    )
  }

  if (testResults && testResults.length > 0) {
    return (
      <div className="h-full overflow-auto">
        <Tabs defaultValue="0" className="h-full">
          <div className="border-b">
            <TabsList className="bg-background h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse">
              {testResults.map((_, index) => (
                <TabsTrigger
                  key={index}
                  value={index.toString()}
                  className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5"
                >
                  Test {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {testResults.map((result, index) => (
            <TabsContent key={index} value={index.toString()}>
              <TestCaseDisplay testResult={result} index={index} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    )
  }

  return (
    <div style={TERMINAL_STYLE}>
      {'> No test results available. Submit your code to see the results.'}
    </div>
  )
}
