'use client'

import { Editor, OnMount } from '@monaco-editor/react'
import { useIDEStore } from './store'
import { useCallback, useRef } from 'react'

export const CodeEditor = () => {
  const { language, codeByLanguage, theme, setCode } = useIDEStore()

  // Set tabSize depending on language
  const tabSize = language === 'python' ? 4 : 2

  const editorRef = useRef<any>(null)
  const handleEditorDidMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor
      // Define theme (could also be passed via prop/context)
      monaco.editor.defineTheme('custom-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: { 'editor.background': '#1a1b26' },
      })
      if (theme === 'vs-dark') {
        monaco.editor.setTheme('custom-dark')
      }
      editor.focus()
    },
    [theme],
  )

  return (
    <Editor
      height="100%"
      language={language}
      theme={theme}
      value={codeByLanguage[language] || ''}
      onChange={(value) => setCode(value || '')}
      onMount={handleEditorDidMount}
      options={{
        scrollBeyondLastLine: false,
        fontSize: 14,
        tabSize,
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
