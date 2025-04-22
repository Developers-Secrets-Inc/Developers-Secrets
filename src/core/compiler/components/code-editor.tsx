'use client'

import { Editor } from '@monaco-editor/react'
import { ReactNode } from 'react'
import { CodeEditorProvider, ProgrammingLanguage, useCodeEditor } from '../providers/code-editor-provider'
import { LanguageSelector } from './language-selector'
import { RunCodeButton } from './run-code-button'


export const CodeEditorHeader = () => {
  return (
    <div className="border-b flex items-center justify-between px-3 py-2 bg-muted/20">
      <div className="flex items-center">
        <LanguageSelector />
      </div>

      <div className="flex items-center gap-2">
        <RunCodeButton />
      </div>
    </div>
  )
}

export const CodeEditorContent = () => {
  const { language, code, theme, readOnly } = useCodeEditor()

  return (
    <Editor
      height="100%"
      language={language}
      value={code}
      theme={theme}
      //   onChange={handleCodeChange}
      //   onMount={handleEditorDidMount}
      //   loading={<EditorLoading />}
      options={{
        readOnly,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
        tabSize: 2,
        automaticLayout: true,
        wordWrap: 'on',
        lineNumbers: 'on',
        glyphMargin: true,
        folding: true,
        lineDecorationsWidth: 10,
        bracketPairColorization: { enabled: true },
      }}
    />
  )
}

export const CodeEditor = ({
  header,
  content,
  footer,
  code,
  language,
  theme,
  availableLanguages = [],
}: {
  header?: ReactNode
  content?: ReactNode
  footer?: ReactNode
  code?: string
  language?: string
  theme?: string
  availableLanguages?: ProgrammingLanguage[]
}) => {
  return (
    <CodeEditorProvider
      initialCode={code}
      initialLanguage={language}
      theme={theme}
      availableLanguages={availableLanguages}
    >
      <div className="h-full flex flex-col border overflow-hidden">
        {header}
        {content}
        {footer}
      </div>
    </CodeEditorProvider>
  )
}
