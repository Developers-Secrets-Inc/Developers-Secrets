'use client'

import { CoursePart } from '@/payload-types'
import { useCallback, useMemo, useState } from 'react'
// Use the provider and namespace object for components
import { compileCode } from '@/core/compiler'; // Import compileCode
import { CodeEditorProvider, GenericCodeEditor } from '@/core/compiler/components/new-editor'
import { ProgrammingLanguage } from '@/core/compiler/components/new-editor/context'
import { Beaker, FileOutput } from 'lucide-react'; // Icons for tabs
import { toast } from 'sonner'
import { createCoursePartSubmission } from '../submissions/client-actions'
import {
  CoursePartTestResult,
  runCoursePartTests
} from '../submissions/testing.client'
// Import the hook and type
import {
  CompletionStatus,
  useCoursePartCompletionStatus,
} from '../hooks/use-course-part-completion-status'
// Import the completion toast hook
import { useCompletionToast } from '../components/completion-toast-context'
// --- CORRECTED IMPORT PATH (Relative) ---
import { recordCoursePartCompletion } from '../skills'
// --- END CORRECTED IMPORT PATH ---
// Import the new hook
import { useSolutionUnlockStatus } from '../progression/hooks/useSolutionUnlockStatus'
// Import the context hook
import { useEditorState } from '../contexts/editor-state-context'

// Define locally until structure is confirmed/imported
type CoursePartTest = {
  input: string
  expectedOutput: string
}

// Simple component to display test results
const TestResultDisplay = ({ result }: { result: CoursePartTestResult | null }) => {
  if (!result) {
    return <div>Run Submit to see test results.</div>
  }

  if (result.type === 'passed') {
    return <div className="text-green-500 p-4">All {result.testsTotal} tests passed!</div>
  }

  if (result.type === 'runtimeError') {
    return (
      <div className="p-4 space-y-2">
        <div className="text-red-500 font-medium">Runtime Error</div>
        <pre className="text-xs bg-muted p-2 rounded">{result.error}</pre>
        <div className="text-xs text-muted-foreground">Input that caused error:</div>
        <pre className="text-xs bg-muted p-2 rounded">{result.failedTestInput}</pre>
      </div>
    )
  }

  if (result.type === 'timeLimitExceeded') {
    return (
      <div className="p-4 space-y-2">
        <div className="text-red-500 font-medium">Time Limit Exceeded</div>
        <div className="text-xs text-muted-foreground">Input that timed out:</div>
        <pre className="text-xs bg-muted p-2 rounded">{result.failedTestInput}</pre>
      </div>
    )
  }

  if (result.type === 'wrongAnswer') {
    return (
      <div className="p-4 space-y-2">
        <div className="text-orange-500 font-medium">Wrong Answer</div>
        <div className="text-xs text-muted-foreground">Input:</div>
        <pre className="text-xs bg-muted p-2 rounded">{result.input}</pre>
        <div className="text-xs text-muted-foreground">Expected Output:</div>
        <pre className="text-xs bg-green-500/10 p-2 rounded">{result.expectedOutput}</pre>
        <div className="text-xs text-muted-foreground">Your Output:</div>
        <pre className="text-xs bg-red-500/10 p-2 rounded">{result.output}</pre>
      </div>
    )
  }

  return <div>Unknown test result state.</div>
}

// Helper to extract editor data (no changes needed)
const extractEditorData = (
  part: CoursePart | null | undefined,
): {
  initialCodePerLanguage: Record<string, string>
  availableLanguages: ProgrammingLanguage[]
  tests: Record<string, CoursePartTest[]>
  initialLanguage: string | undefined
} => {
  const initialCodePerLanguage: Record<string, string> = {}
  const availableLanguages: ProgrammingLanguage[] = []
  const tests: Record<string, CoursePartTest[]> = {}
  let initialLanguage: string | undefined = undefined

  // Assuming structure: part.challenges[0].languages[...]
  const challengeLanguages = part?.challenges?.[0]?.languages
  if (challengeLanguages && Array.isArray(challengeLanguages)) {
    challengeLanguages.forEach((langData, index) => {
      if (langData.name) {
        // Map language name to value/label for editor
        const langValue = langData.name.toLowerCase() // Assuming simple lowercase mapping
        initialCodePerLanguage[langValue] = langData.initialCode || ''
        availableLanguages.push({ value: langValue, label: langData.name }) // Use original name for label
        tests[langValue] =
          langData.testCases?.map((tc) => ({
            input: tc.input || '',
            expectedOutput: tc.expectedOutput || '',
          })) || []

        if (index === 0) {
          initialLanguage = langValue
        }
      }
    })
  }

  // Default to javascript if no languages found?
  if (availableLanguages.length === 0) {
    availableLanguages.push({ value: 'javascript', label: 'JavaScript' })
    initialLanguage = 'javascript'
    initialCodePerLanguage['javascript'] = '// No languages defined for this part'
  }

  return { initialCodePerLanguage, availableLanguages, tests, initialLanguage }
}

type CourseCodeEditorProps = {
  coursePart: CoursePart | null | undefined
  userId: string | null
  initialCompletionStatus: CompletionStatus // Add prop for initial status
}

export function CourseCodeEditor({
  coursePart,
  userId,
  initialCompletionStatus,
}: CourseCodeEditorProps) {
  // State for run output, submit checking, and test results
  const [runOutput, setRunOutput] = useState<string | null>(null)
  const [lastTestResult, setLastTestResult] = useState<CoursePartTestResult | null>(null)
  const [activeTabOverride, setActiveTabOverride] = useState<string>('output')

  // Get the state update functions from the context
  const { _setCurrentCode, _setCurrentLanguage, _setRunOutput, _setLastTestResult } =
    useEditorState()

  // Instantiate the completion status hook
  const {
    status: completionStatus,
    updateStatus: updateCompletionStatus,
    isLoading: isUpdatingStatus,
  } = useCoursePartCompletionStatus({
    partId: coursePart?.id ?? 0,
    userId: userId ?? '',
    initialStatus: initialCompletionStatus,
    enabled: !!userId && !!coursePart,
  })

  // Instantiate the solution unlock status hook
  const { unlockSolution } = useSolutionUnlockStatus({
    partId: coursePart?.id ?? 0,
    userId: userId,
    enabled: !!userId && !!coursePart,
  })

  // Instantiate the completion toast hook
  const { showToast } = useCompletionToast()

  // Memoize the extracted editor data
  const { initialCodePerLanguage, availableLanguages, tests, initialLanguage } = useMemo(() => {
    return extractEditorData(coursePart)
  }, [coursePart])

  // Handler for simple RUN action
  const handleSimpleRun = useCallback(
    async (getCode: () => { code: string; lang: string }) => {
      const { code: currentCode, lang: currentLang } = getCode()
      _setCurrentCode(currentCode)
      _setCurrentLanguage(currentLang)
      setRunOutput('Compiling...')
      setActiveTabOverride('output')
      let outputResult: string | null = null
      try {
        const result = await compileCode(currentCode, currentLang as any)
        outputResult = result.success
          ? result.output || '(No output)'
          : `Error: ${result.error || 'Unknown error'}`
        setRunOutput(outputResult)
      } catch (error) {
        outputResult = `Execution Error: ${error instanceof Error ? error.message : String(error)}`
        setRunOutput(outputResult)
      }
      _setRunOutput(outputResult)
    },
    [_setCurrentCode, _setCurrentLanguage, _setRunOutput],
  )

  // Handler for SUBMIT action (testing and saving)
  const handleSubmit = useCallback(
    async (getCode: () => { code: string; lang: string }) => {
      if (!userId || !coursePart) return
      const { code: currentCode, lang: currentLang } = getCode()
      _setCurrentCode(currentCode)
      _setCurrentLanguage(currentLang)
      const currentTests = tests[currentLang] || []
      if (currentTests.length === 0) {
        toast.info('No tests configured for this language.')
        return
      }

      setLastTestResult(null)
      setActiveTabOverride('testResults')
      toast.info('Running tests...')

      try {
        const result = await runCoursePartTests(
          { content: currentCode, language: currentLang as any },
          currentTests,
        )
        setLastTestResult(result)
        _setLastTestResult(result)

        const submissionResult = await createCoursePartSubmission({
          part: coursePart.id,
          authorId: userId,
          code: result.code,
          submissionType: result.type === 'passed' ? 'accepted' : result.type,
          testsPassed: result.testsPassed,
          testsTotal: result.testsTotal,
          error: 'error' in result ? result.error : undefined,
          input: 'input' in result ? result.input : undefined,
          output: 'output' in result ? result.output : undefined,
          expectedOutput: 'expectedOutput' in result ? result.expectedOutput : undefined,
          lastExpectedOutput:
            result.type === 'runtimeError' || result.type === 'timeLimitExceeded'
              ? [{ output: result.failedTestExpectedOutput }]
              : undefined,
        })

        if (!submissionResult.success) {
          toast.error('Failed to save submission record.', {
            description: submissionResult.error,
          })
        }

        if (result.type === 'passed') {
          toast.success('All tests passed!')
          updateCompletionStatus('completed')

          if (completionStatus !== 'completed') {
            try {
              await recordCoursePartCompletion(userId, coursePart.id)
              console.log(`Skill progression recorded for part ${coursePart.id}`)
            } catch (skillError) {
              console.error('Error triggering skill progression update:', skillError)
              toast.error('Failed to update skill progression, but part is marked complete.')
            }

            console.log(
              `Part ${coursePart.id} already completed, skipping skill progression and solution unlock.`,
            )
          } else {
            console.log(
              `Part ${coursePart.id} already completed, skipping skill progression and solution unlock.`,
            )
          }

          let xpMultiplier = 1
          switch (coursePart?.difficulty) {
            case 'easy':
              xpMultiplier = 1
              break
            case 'medium':
              xpMultiplier = 2
              break
            case 'hard':
              xpMultiplier = 3
              break
            case 'horrible':
              xpMultiplier = 4
              break
          }
          const xpEarned = 50 * xpMultiplier

          showToast({
            xpEarned: xpEarned,
            solutionUnlocked: true,
          })
        } else {
          if (result.type === 'wrongAnswer') toast.warning('Some tests failed.')
          else if (result.type === 'runtimeError') toast.error('Runtime Error.')
          else if (result.type === 'timeLimitExceeded') toast.error('Time Limit Exceeded.')
        }
      } catch (error) {
        console.error('Error running course part tests:', error)
        toast.error('An unexpected error occurred while running tests.')
        _setLastTestResult(null)
      }
    },
    [
      userId,
      coursePart,
      tests,
      updateCompletionStatus,
      showToast,
      completionStatus,
      unlockSolution,
      _setCurrentCode,
      _setCurrentLanguage,
      _setLastTestResult,
    ],
  )

  // Render the provider and compose the editor UI
  return (
    <CodeEditorProvider
      initialCodePerLanguage={initialCodePerLanguage}
      availableLanguages={availableLanguages}
      initialLanguage={initialLanguage ?? 'javascript'}
      onRunOverride={handleSimpleRun}
      onSubmitOverride={handleSubmit}
    >
      <GenericCodeEditor.Header>
        <div className="flex items-center">
          <GenericCodeEditor.LanguageSelector />
        </div>
        <div className="flex items-center gap-2">
          <GenericCodeEditor.RunButton />
          <GenericCodeEditor.SubmitButton />
        </div>
      </GenericCodeEditor.Header>

      <div className="flex-grow overflow-hidden relative">
        <GenericCodeEditor.EditorArea />
      </div>

      <GenericCodeEditor.Footer>
        <GenericCodeEditor.TabTrigger value="output">
          <FileOutput size={14} /> Output
        </GenericCodeEditor.TabTrigger>
        <GenericCodeEditor.TabTrigger value="testResults">
          <Beaker size={14} /> Test Results
        </GenericCodeEditor.TabTrigger>

        <GenericCodeEditor.TabContent value="output">
          {runOutput ?? '> Click Run to execute code.'}
        </GenericCodeEditor.TabContent>
        <GenericCodeEditor.TabContent value="testResults">
          <TestResultDisplay result={lastTestResult} />
        </GenericCodeEditor.TabContent>
      </GenericCodeEditor.Footer>
    </CodeEditorProvider>
  )
}
