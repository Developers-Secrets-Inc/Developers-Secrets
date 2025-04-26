'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { CoursePart } from '@/payload-types'
// Use the provider and namespace object for components
import { CodeEditorProvider, GenericCodeEditor } from '@/core/compiler/components/new-editor'
import { ProgrammingLanguage } from '@/core/compiler/components/new-editor/context'
import {
  runCoursePartTests,
  CoursePartTestResult,
  CoursePartRuntimeError,
  CoursePartWrongAnswer,
  CoursePartTimeLimitExceeded,
} from '../submissions/testing.client'
import { createCoursePartSubmission } from '../submissions/client-actions'
import { updateUserPartCompletionStatus } from '../progression/completion-status'
import { toast } from 'sonner'
import { FileOutput, Beaker } from 'lucide-react' // Icons for tabs
import { cn } from '@/lib/utils' // For styling results
import { compileCode, CompilationResult } from '@/core/compiler' // Import compileCode
// Import the hook and type
import {
  useCoursePartCompletionStatus,
  CompletionStatus,
} from '../hooks/use-course-part-completion-status'

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
  const [isChecking, setIsChecking] = useState(false)
  const [lastTestResult, setLastTestResult] = useState<CoursePartTestResult | null>(null)
  const [activeTabOverride, setActiveTabOverride] = useState<string>('output')

  // Instantiate the completion status hook
  const {
    status: completionStatus, // Use the status from the hook if needed elsewhere
    updateStatus: updateCompletionStatus, // Get the update function
    isLoading: isUpdatingStatus, // Optional: use loading state
  } = useCoursePartCompletionStatus({
    partId: coursePart?.id ?? 0, // Provide a default or handle null case appropriately
    userId: userId ?? '', // Provide a default or handle null case
    initialStatus: initialCompletionStatus,
    enabled: !!userId && !!coursePart, // Only enable if userId and coursePart are valid
  })

  // Memoize the extracted editor data
  const { initialCodePerLanguage, availableLanguages, tests, initialLanguage } = useMemo(() => {
    return extractEditorData(coursePart)
  }, [coursePart])

  // Handler for simple RUN action
  const handleSimpleRun = useCallback(async (getCode: () => { code: string; lang: string }) => {
    const { code: currentCode, lang: currentLang } = getCode()
    setRunOutput('Compiling...')
    setActiveTabOverride('output') // Switch to output tab on run
    try {
      const result = await compileCode(currentCode, currentLang as any)
      setRunOutput(
        result.success
          ? result.output || '(No output)'
          : `Error: ${result.error || 'Unknown error'}`,
      )
    } catch (error) {
      setRunOutput(`Execution Error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, []) // No external dependencies needed here if compileCode is pure

  // Handler for SUBMIT action (testing and saving)
  const handleSubmit = useCallback(
    async (getCode: () => { code: string; lang: string }) => {
      if (!userId || !coursePart) return
      const { code: currentCode, lang: currentLang } = getCode()
      const currentTests = tests[currentLang] || []
      if (currentTests.length === 0) {
        toast.info('No tests configured for this language.')
        return
      }

      setLastTestResult(null)
      setActiveTabOverride('testResults') // Switch to test results tab on submit
      toast.info('Running tests...')

      try {
        const result = await runCoursePartTests(
          { content: currentCode, language: currentLang as any },
          currentTests,
        )
        setLastTestResult(result)

        // Save the submission attempt (no changes needed here)
        const submissionResult = await createCoursePartSubmission({
          part: coursePart.id, // Assuming coursePart is not null here
          authorId: userId,
          code: result.code,
          submissionType: result.type === 'passed' ? 'accepted' : result.type,
          testsPassed: result.testsPassed,
          testsTotal: result.testsTotal,
          // Add failure details if present
          error: 'error' in result ? result.error : undefined,
          input: 'input' in result ? result.input : undefined,
          output: 'output' in result ? result.output : undefined,
          expectedOutput: 'expectedOutput' in result ? result.expectedOutput : undefined,
          // Correctly format lastExpectedOutput based on error type and expected structure
          lastExpectedOutput:
            result.type === 'runtimeError' || result.type === 'timeLimitExceeded'
              ? [{ output: result.failedTestExpectedOutput }] // Create the expected array structure
              : undefined,
        })

        if (!submissionResult.success) {
          toast.error('Failed to save submission record.', {
            description: submissionResult.error,
          })
        }

        // Update progression if passed using the hook
        if (result.type === 'passed') {
          toast.success('All tests passed!')
          // Call the hook's update function for optimistic update
          updateCompletionStatus('completed')
          // No need for try/catch here, hook handles errors
          // // try {
          // //   await updateUserPartCompletionStatus(userId, coursePart.id, 'completed')
          // //   // Optionally trigger confetti or other success UI
          // // } catch (progressionError) {
          // //   toast.error('Failed to update completion status.', {
          // //     description: progressionError instanceof Error ? progressionError.message : undefined,
          // //   })
          // // }
        } else {
          // Give feedback on failure type
          if (result.type === 'wrongAnswer') toast.warning('Some tests failed.')
          else if (result.type === 'runtimeError') toast.error('Runtime Error.')
          else if (result.type === 'timeLimitExceeded') toast.error('Time Limit Exceeded.')
        }
      } catch (error) {
        console.error('Error running course part tests:', error)
        toast.error('An unexpected error occurred while running tests.')
        // TODO: Update terminal UI with generic error message
      }
    },
    [userId, coursePart, tests, updateCompletionStatus], // Removed isChecking dependency
  )

  // Render the provider and compose the editor UI
  return (
    <CodeEditorProvider
      initialCodePerLanguage={initialCodePerLanguage}
      availableLanguages={availableLanguages}
      initialLanguage={initialLanguage ?? 'javascript'}
      // Pass the override handlers
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
        {/* Define the tabs for the footer */}
        <GenericCodeEditor.TabTrigger value="output">
          <FileOutput size={14} /> Output
        </GenericCodeEditor.TabTrigger>
        <GenericCodeEditor.TabTrigger value="testResults">
          <Beaker size={14} /> Test Results
        </GenericCodeEditor.TabTrigger>

        <GenericCodeEditor.TabContent value="output">
          {/* Content for the Output tab comes from runOutput state */}
          {runOutput ?? '> Click Run to execute code.'}
        </GenericCodeEditor.TabContent>
        <GenericCodeEditor.TabContent value="testResults">
          {/* Content for the Test Results tab */}
          <TestResultDisplay result={lastTestResult} />
        </GenericCodeEditor.TabContent>
      </GenericCodeEditor.Footer>
    </CodeEditorProvider>
  )
}
