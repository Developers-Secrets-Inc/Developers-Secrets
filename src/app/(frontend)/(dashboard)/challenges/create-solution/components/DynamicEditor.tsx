'use client'

import dynamic from 'next/dynamic'
import { forwardRef } from 'react'

const Editor = dynamic(() => import('./Editor'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-background/50">
      Loading editor...
    </div>
  ),
})

interface DynamicEditorProps {
  onSaveContent?: (markdown: string) => void
  initialContent?: string
}

export interface DynamicEditorRef {
  getCurrentContent: () => Promise<string>
}

export const DynamicEditor = forwardRef<DynamicEditorRef, DynamicEditorProps>(
  ({ onSaveContent, initialContent }, ref) => {
    return <Editor ref={ref} onSaveContent={onSaveContent} initialContent={initialContent} />
  },
)

DynamicEditor.displayName = 'DynamicEditor'
