'use client'

import '@blocknote/core/fonts/inter.css'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { useCreateBlockNote } from '@blocknote/react'
import { PartialBlock } from '@blocknote/core'
import { useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'

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

export interface EditorRef {
  getCurrentContent: () => Promise<string>
}

const Editor = forwardRef<EditorRef, EditorProps>(({ onSaveContent, initialContent }, ref) => {
  const editor = useCreateBlockNote({
    initialContent: defaultContent,
  })

  const getCurrentContent = useCallback(async () => {
    if (editor) {
      const blocks = editor.document
      const markdown = await editor.blocksToMarkdownLossy(blocks)
      // Préserver les sauts de ligne multiples en ajoutant des espaces
      return markdown.replace(/\n\n+/g, (match) => match.split('\n').join('\n \n'))
    }
    return initialContent || ''
  }, [editor, initialContent])

  useImperativeHandle(ref, () => ({
    getCurrentContent,
  }))

  const updateContent = useCallback(async () => {
    if (onSaveContent) {
      const content = await getCurrentContent()
      onSaveContent(content)
    }
  }, [getCurrentContent, onSaveContent])

  // Parse and set initial content only once when the editor is ready
  useEffect(() => {
    const initializeContent = async () => {
      if (editor && initialContent) {
        try {
          // Restaurer les sauts de ligne multiples
          const restoredMarkdown = initialContent.replace(/\n \n/g, '\n\n')
          const blocks = await editor.tryParseMarkdownToBlocks(restoredMarkdown)
          if (blocks.length > 0) {
            editor.replaceBlocks(editor.document, blocks)
          }
        } catch (error) {
          console.error('Failed to parse markdown:', error)
        }
      }
    }
    initializeContent()
  }, [editor, initialContent])

  // Debounced content updates
  useEffect(() => {
    if (editor && onSaveContent) {
      const timeout = setTimeout(updateContent, 500)
      return () => clearTimeout(timeout)
    }
  }, [editor, onSaveContent, updateContent])

  return (
    <BlockNoteView
      editor={editor}
      editable={true}
      className="h-full rounded-none bg-background/50"
    />
  )
})

Editor.displayName = 'Editor'

export default Editor
