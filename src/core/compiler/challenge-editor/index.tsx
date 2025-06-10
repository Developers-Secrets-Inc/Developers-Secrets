'use client'

import { ChallengeEditorContainer, ChallengeEditor } from './editor'
import { TerminalTabs, TerminalContent } from './footer'
import {
  ChallengeIDEHeader,
  ChallengeIDEHeaderLeftPart,
  ChallengeIDEHeaderRightPart,
  LanguageSelector,
  RunButton,
  SubmitButton,
} from './header'
import { useChallengeEditorStore } from './store'
import { useEffect } from 'react'

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
}

export const ChallengeIDE = (props: ChallengeIDEProps) => {
  const initialize = useChallengeEditorStore((state) => state.initialize)

  useEffect(() => {
    if (props.codeVersions) {
      initialize(props.codeVersions)
    }
  }, [props.codeVersions, initialize])

  return (
    <ChallengeIDEContainer>
      <ChallengeIDEHeader>
        <ChallengeIDEHeaderLeftPart>
          <LanguageSelector />
        </ChallengeIDEHeaderLeftPart>
        <ChallengeIDEHeaderRightPart>
          <RunButton onRun={props.onRun} />
          <SubmitButton onSubmit={props.onSubmit} />
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
