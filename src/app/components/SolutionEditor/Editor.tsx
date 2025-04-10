'use client'

import '@blocknote/core/fonts/inter.css'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { useCreateBlockNote } from '@blocknote/react'
import { PartialBlock } from '@blocknote/core'
import { useEffect } from 'react'

const initialContent: PartialBlock[] = [
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
}

export default function Editor({ onSaveContent }: EditorProps) {
  const editor = useCreateBlockNote({
    initialContent,
  })

  const getMarkdownContent = async () => {
    const markdown = await editor.blocksToMarkdownLossy(editor.document)
    return markdown
  }

  // Expose the getMarkdownContent function through a ref
  useEffect(() => {
    if (onSaveContent) {
      // Attach the getMarkdownContent function to the window temporarily
      // This is a workaround to pass the function up to the parent component
      ;(window as any).__getEditorContent = async () => {
        const markdown = await getMarkdownContent()
        onSaveContent(markdown)
      }

      return () => {
        delete (window as any).__getEditorContent
      }
    }
  }, [onSaveContent])

  return (
    <BlockNoteView editor={editor} editable={true} className="h-full rounded-none bg-[#1f1f1f]" />
  )
}
