'use client'

import { CodeEditor } from '@/core/compiler/components/last-editor/code-editor'
import { Footer } from '@/core/compiler/components/last-editor/footer'
import { TabContent } from '@/core/compiler/components/last-editor/footer'
import { TabTrigger } from '@/core/compiler/components/last-editor/footer'
import {
  IDEHeader,
  LanguageSelector,
  RunButton,
} from '@/core/compiler/components/last-editor/header'
import { useIDEStore } from '@/core/compiler/components/last-editor/store'
import { useEffect, useMemo } from 'react'
import { SubmitButton } from './submit-button'
import { EditorSettings } from '@/core/compiler/components/last-editor/header/editor-settings'

type SupportedLanguage = 'python' | 'javascript' | 'typescript'

type Challenge = {
  languages: {
    name: SupportedLanguage
    initialCode: string
    testCases: {
      input: string
      expectedOutput: string
    }[]
  }[]
}

export const ChallengeIDE = ({ challenge }: { challenge: Challenge }) => {
  const availableLanguages = useMemo(() => challenge.languages.map((l) => l.name), [challenge])
  const codeByLanguage = useMemo(
    () => Object.fromEntries(challenge.languages.map((l) => [l.name, l.initialCode])),
    [challenge],
  )
  const defaultLanguage = availableLanguages[0]

  const { initialize, output } = useIDEStore()

  useEffect(() => {
    initialize({
      availableLanguages,
      codeByLanguage,
      language: defaultLanguage,
    })
  }, [initialize, availableLanguages, codeByLanguage, defaultLanguage])

  return (
    <div className="flex flex-col h-full bg-muted/40">
      <IDEHeader>
        <LanguageSelector />
        <div className="flex items-center gap-2">
          <RunButton />
          <SubmitButton />
          {/* <EditorSettings /> */}
        </div>
      </IDEHeader>
      <div className="flex-grow overflow-hidden relative">
        <CodeEditor />
      </div>
      <Footer>
        <TabTrigger value="testCases">Test Cases</TabTrigger>
        <TabContent value="testCases">
          <div style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
        </TabContent>
        <TabTrigger value="output">Output</TabTrigger>
        <TabContent value="output">
          <div style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
        </TabContent>
      </Footer>
    </div>
  )
}
