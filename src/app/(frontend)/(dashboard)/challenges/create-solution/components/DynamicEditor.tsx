'use client'

import dynamic from 'next/dynamic'

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

export const DynamicEditor = ({ onSaveContent, initialContent }: DynamicEditorProps) => {
  return <Editor onSaveContent={onSaveContent} initialContent={initialContent} />
}
