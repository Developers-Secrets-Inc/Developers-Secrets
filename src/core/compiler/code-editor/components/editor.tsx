'use client'

import { cn } from '@/lib/utils'
import { Editor, OnMount } from '@monaco-editor/react'
// import { useChallengeEditorStore } from '../store'
import { useRef } from 'react'
import { useFooterStore } from '../store/footer-store'

type ChallengeEditorProps = {
  onChange?: (code: string) => void
}

export const ChallengeEditor = ({ onChange }: ChallengeEditorProps) => {
//   const { currentLanguage, codeByLanguage, setCode } = useChallengeEditorStore()
  const editorRef = useRef<unknown>(null)

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
    //   setCode(currentLanguage, value)
      onChange?.(value)
    }
  }

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1a1b26',
      },
    })
    monaco.editor.setTheme('custom-dark')
    editor.focus()
  }

  return (
    <Editor
      height="100%"
    //   language={currentLanguage}
    //   value={codeByLanguage[currentLanguage]}
      onChange={handleCodeChange}
      theme="vs-dark"
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
        // tabSize: currentLanguage === 'python' ? 4 : 2,
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


export const ChallengeEditorContainer = ({ children }: { children: React.ReactNode }) => {

  return (
    <div
      className={cn(
        'relative flex-grow transition-all duration-300 ease-in-out h-full',
      )}
    >
      {children}
    </div>
  )
}