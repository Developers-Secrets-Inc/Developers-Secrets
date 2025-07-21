'use client'

import React from 'react'
import { CodeEditorProvider, GenericCodeEditor } from './index' // Import from index
import { ProgrammingLanguage, useGenericCodeEditor } from './context' // Import types and context

// Props for the wrapper, mirroring CodeEditorProvider props except children
type EditorClientBoundaryProps = {
  initialCodePerLanguage?: Record<string, string>
  initialLanguage?: string
  availableLanguages?: ProgrammingLanguage[]
  onCodeChangeProp?: (code: string, language: string) => void
  onLanguageChangeProp?: (language: string) => void
  readOnly?: boolean
  theme?: 'vs' | 'vs-dark' | 'hc-black'
  showLanguageSelector?: boolean
  defaultCode?: string
  // Update the override prop type signature
  onRunOverride?: (getCode: () => { code: string; lang: string }) => Promise<void>
}

export function EditorClientBoundary({
  onRunOverride,
  ...providerProps
}: EditorClientBoundaryProps) {
  return (
    // Pass the override prop down to the provider
    <CodeEditorProvider {...providerProps} onRunOverride={onRunOverride}>
      {/* Inner component doesn't need the prop directly anymore */}
      <EditorLayout />
    </CodeEditorProvider>
  )
}

// Inner component doesn't need the prop now
function EditorLayout() {
  // Get the runAction directly from context - provider has already configured it
  const { runAction } = useGenericCodeEditor()

  // This component just renders the layout now
  return (
    <>
      <GenericCodeEditor.Header>
        <div className="flex items-center">
          <GenericCodeEditor.LanguageSelector />
        </div>
        <div className="flex items-center gap-2">
          {/* RunButton uses runAction from context */}
          <GenericCodeEditor.RunButton />
        </div>
      </GenericCodeEditor.Header>

      <div className="flex-grow overflow-hidden relative">
        <GenericCodeEditor.EditorArea />
      </div>

      <GenericCodeEditor.Footer>
        <>{/* Empty fragment to satisfy required children prop */}</>
        {/* Footer provides default output tab automatically */}
      </GenericCodeEditor.Footer>
    </>
  )
}
