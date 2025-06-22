'use client'

import { Challenge } from '@/payload-types'
import { forwardRef, useEffect, useRef } from 'react'
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
import { useChallengeEditorStore } from './store'
import { SubmitButton } from './header/submit-button'
import { useChallengeTour } from '@/core/challenges/components/challenge-tour-context'

const ChallengeIDEContainer = forwardRef<HTMLDivElement, { children: React.ReactNode; htmlId?: string }>(
  ({ children, htmlId }, ref) => {
    return (
      <div id={htmlId} className="h-full flex flex-col border-t overflow-hidden" ref={ref}>
        {children}
      </div>
    )
  },
)
ChallengeIDEContainer.displayName = 'ChallengeIDEContainer' // Add display name for debugging

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
  htmlId?: string
}

export const ChallengeIDE = (props: ChallengeIDEProps) => {
  const {
    initialize,
    setActiveTerminalTab,
    isTerminalOpen,
    toggleTerminal,
    codeByLanguage,
    currentLanguage,
    availableLanguages,
    setIsLoadingRun,
    setExecutionOutput,
  } = useChallengeEditorStore()

  const { registerRef } = useChallengeTour()
  const ideRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (props.codeVersions) {
      initialize(props.codeVersions)
    }
  }, [props.codeVersions, initialize])

  useEffect(() => {
    if (props.htmlId === 'challenge-code-editor' && ideRef.current) {
      registerRef('challenge-code-editor', ideRef)
    }
  }, [props.htmlId, registerRef])

  const { isLoadingRun, executionOutput, runCode: runCodeHook } = useRunCode()

  const handleRun = async () => {
    // if (onRun) onRun()

    setActiveTerminalTab('output')
    if (!isTerminalOpen) {
      toggleTerminal()
    }

    const code = codeByLanguage[currentLanguage]
    setIsLoadingRun(true)
    await runCodeHook({ code, language: currentLanguage })
    setExecutionOutput(executionOutput)
    setIsLoadingRun(false)
  }

  return (
    <ChallengeIDEContainer htmlId={props.htmlId} ref={ideRef}>
      <ChallengeIDEHeader>
        <ChallengeIDEHeaderLeftPart>
          <LanguageSelector />
        </ChallengeIDEHeaderLeftPart>
        <ChallengeIDEHeaderRightPart>
          <RunButton onRun={handleRun} isRunning={isLoadingRun} isDisabled={false} />
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
