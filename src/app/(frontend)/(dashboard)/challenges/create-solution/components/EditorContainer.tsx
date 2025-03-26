'use client'

import { useState } from 'react'
import SolutionEditor from './index'
import EditorToolbar from './EditorToolbar'
import SolutionMetadata, { SolutionMetadata as SolutionMetadataType } from './SolutionMetadata'

interface SolutionData {
  metadata: SolutionMetadataType
  content: string
}

export default function EditorContainer() {
  const [isSaving, setIsSaving] = useState(false)
  const [solutionData, setSolutionData] = useState<SolutionData>({
    metadata: {
      title: '',
      description: '',
      tags: [],
    },
    content: '',
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Get the markdown content using the exposed function
      if ((window as any).__getEditorContent) {
        await (window as any).__getEditorContent()
        console.log('Solution Data:', {
          title: solutionData.metadata.title,
          description: solutionData.metadata.description,
          tags: solutionData.metadata.tags.map((tag) => tag.label),
          content: solutionData.content,
        })
      }
    } catch (error) {
      console.error('Error saving content:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleContent = (markdown: string) => {
    setSolutionData((prev) => ({
      ...prev,
      content: markdown,
    }))
  }

  const handleMetadataChange = (metadata: SolutionMetadataType) => {
    setSolutionData((prev) => ({
      ...prev,
      metadata,
    }))
  }

  return (
    <div className="flex flex-col w-full h-full bg-[#1f1f1f]">
      <div className="sticky top-0 z-10 bg-[#1f1f1f]">
        <EditorToolbar onSave={handleSave} isSaving={isSaving} />
      </div>
      <SolutionMetadata onChange={handleMetadataChange} />
      <div className="flex-1 h-full overflow-auto bg-[#1f1f1f]">
        <SolutionEditor onSaveContent={handleContent} />
      </div>
    </div>
  )
}
