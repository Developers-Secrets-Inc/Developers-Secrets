'use client'

import { BlockNoteEditor, PartialBlock } from '@blocknote/core'
import { useEffect, useRef, useState } from 'react'
import { SolutionFormState, useSolutionFormStore } from '../store/solution-form-store'
// import { DynamicEditor, EditorRef } from './DynamicEditor' // Remove standard import
import SolutionMetadata from './SolutionMetadata'
import dynamic from 'next/dynamic' // Import dynamic
import { Skeleton } from '@/components/ui/skeleton' // Import Skeleton
import { EditorRef } from './DynamicEditor' // Import only the type

// Dynamically import the Editor component with ssr: false
const DynamicEditor = dynamic(() => import('./DynamicEditor').then((mod) => mod.DynamicEditor), {
  ssr: false,
  loading: () => <Skeleton className="h-[500px] w-full rounded-lg" />, // Use Skeleton while loading
})

export default function CreateSolutionForm() {
  const editorRef = useRef<EditorRef>(null)

  // Select state slices individually
  const initialRawContent = useSolutionFormStore((state) => state.initialRawContent)
  const setEditorContentGetter = useSolutionFormStore((state) => state.setEditorContentGetter)

  const [initialBlocks, setInitialBlocks] = useState<PartialBlock[] | undefined>(undefined)
  // Parsing state is now handled internally by DynamicEditor loading state
  // const [isParsingContent, setIsParsingContent] = useState<boolean>(!!initialRawContent)

  // Effect to parse initial markdown content
  useEffect(() => {
    let isMounted = true
    if (initialRawContent) {
      // setIsParsingContent(true) // No longer needed
      const parseMarkdown = async () => {
        try {
          const editor = await BlockNoteEditor.create() // Create a temporary editor for parsing
          const blocks = await editor.tryParseMarkdownToBlocks(
            initialRawContent.replace(/\n \n/g, '\n\n'),
          )
          if (isMounted) {
            setInitialBlocks(blocks.length > 0 ? blocks : undefined)
            // setIsParsingContent(false) // No longer needed
          }
        } catch (error) {
          console.error('Failed to parse initial markdown in CreateSolutionForm:', error)
          if (isMounted) {
            setInitialBlocks(undefined)
            // setIsParsingContent(false) // No longer needed
          }
        }
        // No finally needed as loading state handles UI
      }
      parseMarkdown()
    } else {
      setInitialBlocks(undefined)
      // setIsParsingContent(false) // No longer needed
    }
    return () => {
      isMounted = false
    }
  }, [initialRawContent])

  return (
    <>
      <div className="space-y-2 border-b border-border pb-4">
        <SolutionMetadata />
      </div>
      <div className="flex-1 overflow-hidden border-b border-border pb-4">
        {/* DynamicEditor handles its own loading state via next/dynamic */}
        <DynamicEditor
          ref={editorRef}
          initialBlocks={initialBlocks}
          onEditorReady={setEditorContentGetter}
        />
      </div>
    </>
  )
}
