'use client'

import '@blocknote/core/fonts/inter.css'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { useCreateBlockNote } from '@blocknote/react'
import { PartialBlock } from '@blocknote/core'
import { useEffect, useCallback } from 'react'

const defaultContent: PartialBlock[] = [
  {
    type: 'heading',
    props: {
      textColor: 'default',
      backgroundColor: 'default',
      textAlignment: 'left',
      level: 2,
    },
    content: 'Write your solution here...',
  },
]

interface EditorProps {
  onSaveContent?: (markdown: string) => void
  initialContent?: string
}

export default function Editor({ onSaveContent, initialContent }: EditorProps) {
  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? [
          {
            type: 'paragraph',
            props: {
              textColor: 'default',
              backgroundColor: 'default',
              textAlignment: 'left',
            },
            content: initialContent,
          },
        ]
      : defaultContent,
  })

  const updateContent = useCallback(async () => {
    if (onSaveContent && editor) {
      const markdown = await editor.blocksToMarkdownLossy(editor.document)
      onSaveContent(markdown)
    }
  }, [editor, onSaveContent])

  // Update content whenever the editor changes
  useEffect(() => {
    if (editor && onSaveContent) {
      editor.onEditorContentChange(() => {
        updateContent()
      })
    }
  }, [editor, onSaveContent, updateContent])

  // Initial content update
  useEffect(() => {
    updateContent()
  }, [updateContent])

  return (
    <BlockNoteView
      editor={editor}
      editable={true}
      className="h-full rounded-none bg-background/50"
    />
  )
}
