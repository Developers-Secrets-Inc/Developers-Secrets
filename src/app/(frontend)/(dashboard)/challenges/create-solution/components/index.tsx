'use client'

import { DynamicEditor } from './DynamicEditor'
import { forwardRef, useImperativeHandle, useRef } from 'react'

interface SolutionEditorProps {
  onSaveContent?: (markdown: string) => void
  initialContent?: string
}

export interface SolutionEditorRef {
  getCurrentContent: () => Promise<string>
}

const SolutionEditor = forwardRef<SolutionEditorRef, SolutionEditorProps>(
  ({ onSaveContent, initialContent }, ref) => {
    const editorRef = useRef<{ getCurrentContent: () => Promise<string> }>()

    useImperativeHandle(ref, () => ({
      getCurrentContent: async () => {
        if (editorRef.current) {
          return await editorRef.current.getCurrentContent()
        }
        return initialContent || ''
      },
    }))

    return (
      <div className="h-full w-full">
        <DynamicEditor
          ref={editorRef}
          onSaveContent={onSaveContent}
          initialContent={initialContent}
        />
      </div>
    )
  },
)

SolutionEditor.displayName = 'SolutionEditor'

export default SolutionEditor
