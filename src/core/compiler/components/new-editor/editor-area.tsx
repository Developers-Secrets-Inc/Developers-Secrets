'use client'

import { Editor } from '@monaco-editor/react'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { useGenericCodeEditor } from './context'

const EditorLoading = () => (
  <div className="flex items-center justify-center h-full">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2">Loading editor...</span>
  </div>
)

export const EditorArea = () => {
  const {
    currentLanguage,
    codeByLanguage,
    theme,
    handleCodeChange,
    handleEditorDidMount,
    readOnly,
  } = useGenericCodeEditor()

  return (
    <Editor
      height="100%"
      language={currentLanguage}
      value={codeByLanguage[currentLanguage] || ''}
      theme={theme}
      onChange={handleCodeChange}
      onMount={handleEditorDidMount}
      loading={<EditorLoading />}
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
