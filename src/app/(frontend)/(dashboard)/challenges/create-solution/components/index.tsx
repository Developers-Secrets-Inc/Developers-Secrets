'use client'

import { DynamicEditor } from './DynamicEditor'

interface SolutionEditorProps {
  onSaveContent?: (markdown: string) => void
}

export default function SolutionEditor({ onSaveContent }: SolutionEditorProps) {
  return (
    <div className="h-full w-full">
      <DynamicEditor onSaveContent={onSaveContent} />
    </div>
  )
}
