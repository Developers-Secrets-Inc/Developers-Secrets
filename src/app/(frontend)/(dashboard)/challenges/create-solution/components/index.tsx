'use client'

import { DynamicEditor } from './DynamicEditor'

interface SolutionEditorProps {
  onSaveContent?: (markdown: string) => void
  initialContent?: string
}

export default function SolutionEditor({ onSaveContent, initialContent }: SolutionEditorProps) {
  return (
    <div className="h-full w-full">
      <DynamicEditor onSaveContent={onSaveContent} initialContent={initialContent} />
    </div>
  )
}
