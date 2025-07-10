'use client'

import { Challenge } from '@/payload-types'
import { forwardRef, useEffect } from 'react' // Import useState
import { useRunCode } from '../hooks/use-run-code'
import { ChallengeEditor, ChallengeEditorContainer } from './editor'
import { TerminalContent, TerminalTabs } from './footer'
import {
  ChallengeIDEHeader,
  ChallengeIDEHeaderLeftPart,
  ChallengeIDEHeaderRightPart,
  LanguageSelector,
  RunButton,
} from './header'
import { SubmitButton } from './header/submit-button'
import { useChallengeEditorStore } from './store'

const ChallengeIDEContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="h-full flex flex-col border-t overflow-hidden">{children}</div>
}

type CodeVersion = {
  language: string
  initialCode: string
  testCases: Array<{
    input: string
    expectedOutput: string
  }>
}

type ChallengeIDEProps = {
  onRun?: () => void
  onSubmit?: () => void
  onChange?: (code: string) => void
  codeVersions?: CodeVersion[]
  challenge: Challenge
  userId: string
}

export const ChallengeIDE = (props: ChallengeIDEProps) => {
  const {
    initialize,
    setActiveTerminalTab,
    isTerminalOpen,
    toggleTerminal,
    codeByLanguage,
    currentLanguage,
    setExecutionOutput,
    setPrecheckError, // Use the new setter for precheck errors
  } = useChallengeEditorStore()

  useEffect(() => {
    if (props.codeVersions) {
      initialize(props.codeVersions)
    }
  }, [props.codeVersions, initialize])

  const { isLoadingRun, executionOutput, runCode, error } = useRunCode()

  // Update the store whenever the hook's output/error changes
  useEffect(() => {
    if (error) {
      setPrecheckError(error)
      setExecutionOutput('') // Clear main output on error
    } else {
      setExecutionOutput(executionOutput || '')
      setPrecheckError(null) // Clear precheck error on success
    }
  }, [executionOutput, error, setExecutionOutput, setPrecheckError])

  const handleRun = async () => {
    setActiveTerminalTab('output')
    if (!isTerminalOpen) {
      toggleTerminal()
    }

    const code = codeByLanguage[currentLanguage]
    // The hook now manages its own loading state, so we just call the function.
    await runCode({ code, language: currentLanguage })
  }

  return (
    <ChallengeIDEContainer>
      <ChallengeIDEHeader>
        <ChallengeIDEHeaderLeftPart>
          <LanguageSelector />
        </ChallengeIDEHeaderLeftPart>
        <ChallengeIDEHeaderRightPart>
          <RunButton onRun={handleRun} isRunning={isLoadingRun} isDisabled={isLoadingRun} />
          {/* SubmitButton logic remains untouched */}
          <SubmitButton challenge={props.challenge} userId={props.userId} />
        </ChallengeIDEHeaderRightPart>
      </ChallengeIDEHeader>

      <ChallengeEditorContainer>
        <ChallengeEditor onChange={props.onChange} />
      </ChallengeEditorContainer>

      <TerminalTabs />
      <TerminalContent />
    </ChallengeIDEContainer>
  )
}
