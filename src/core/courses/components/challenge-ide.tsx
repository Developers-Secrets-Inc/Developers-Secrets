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
import { useSubmissionStore } from '../submissions/store'
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

export const ChallengeIDE = ({ challenge, partId }: { challenge: Challenge; partId: string }) => {
  const availableLanguages = useMemo(() => challenge.languages.map((l) => l.name), [challenge])
  const codeByLanguage = useMemo(
    () => Object.fromEntries(challenge.languages.map((l) => [l.name, l.initialCode])),
    [challenge],
  )
  const defaultLanguage = availableLanguages[0]

  console.log(challenge.languages[0].testCases)

  const { initialize, output, setOutput } = useIDEStore()
  const { testResults, error, setCurrentPart } = useSubmissionStore()
  
  // Définir la partie courante dans le store
  useEffect(() => {
    setCurrentPart(partId)
  }, [partId, setCurrentPart])

  useEffect(() => {
    initialize({
      availableLanguages,
      codeByLanguage,
      language: defaultLanguage,
    })
  }, [initialize, availableLanguages, codeByLanguage, defaultLanguage])

  // Mettre à jour la sortie avec les résultats des tests
  useEffect(() => {
    if (testResults) {
      const testOutput = testResults
        .map(
          (test, index) =>
            `Test ${index + 1}: ${test.passed ? '✅ Passed' : '❌ Failed'}\n` +
            `Input: ${test.input}\n` +
            `Expected: ${test.expectedOutput}\n` +
            `Got: ${test.output}${test.error ? `\nError: ${test.error}` : ''}\n`,
        )
        .join('\n')

      setOutput(testOutput)
    }
  }, [testResults, setOutput])

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
          {error ? (
            <div className="text-red-500 p-4">
              <p>Error: {error}</p>
            </div>
          ) : testResults ? (
            <div className="p-4 space-y-4">
              {testResults.map((test, index) => (
                <div key={index} className="p-3 border-b">
                  <div className="font-medium">
                    Test {index + 1}: {test.passed ? '✅ Passed' : '❌ Failed'}
                  </div>
                  <div className="text-sm mt-1 space-y-1">
                    <div>Input: <code>{test.input}</code></div>
                    <div>Expected: <code>{test.expectedOutput}</code></div>
                    <div>Got: <code>{test.output}</code></div>
                    {test.error && <div className="text-red-600">Error: {test.error}</div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-gray-500">Run the code to see test results</div>
          )}
        </TabContent>
        <TabTrigger value="output">Output</TabTrigger>
        <TabContent value="output">
          <div style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
        </TabContent>
      </Footer>
    </div>
  )
}
