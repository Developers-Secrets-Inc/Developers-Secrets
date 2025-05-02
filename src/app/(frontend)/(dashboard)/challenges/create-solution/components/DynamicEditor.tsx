'use client'

import { forwardRef, useImperativeHandle, useEffect } from 'react'
import '@blocknote/core/fonts/inter.css'
import { Theme, lightDefaultTheme, darkDefaultTheme, BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { useSolutionEditor } from '../hooks/use-solution-editor'
import { PartialBlock } from '@blocknote/core'
import { Skeleton } from '@/components/ui/skeleton'

// --- Theme Definition ---
const lightAppTheme = {
  ...lightDefaultTheme,
  colors: {
    ...lightDefaultTheme.colors,
    editor: {
      text: 'oklch(0.141 0.005 285.823)', // --foreground
      background: 'oklch(1 0 0)', // --background
    },
  },
} satisfies Theme

const darkAppTheme = {
  ...darkDefaultTheme,
  colors: {
    ...darkDefaultTheme.colors,
    editor: {
      text: 'oklch(0.985 0 0)', // dark --foreground
      background: 'oklch(0.21 0.006 285.885)', // dark --background
    },
  },
} satisfies Theme

const appTheme = {
  light: lightAppTheme,
  dark: darkAppTheme,
}
// --- End Theme Definition ---

// --- Props and Ref Interfaces ---
interface EditorProps {
  initialBlocks?: PartialBlock[]
  onEditorReady?: (getter: () => Promise<string>) => void
}

export interface EditorRef {
  getCurrentContent: () => Promise<string>
}
// --- End Interfaces ---

// --- Main Editor Component Logic ---
export const DynamicEditor = forwardRef<EditorRef, EditorProps>(
  ({ initialBlocks, onEditorReady }, ref) => {
    const { editor, getCurrentContent } = useSolutionEditor(initialBlocks)

    useImperativeHandle(ref, () => ({
      getCurrentContent: getCurrentContent,
    }))

    useEffect(() => {
      if (editor && typeof onEditorReady === 'function') {
        console.log('DynamicEditor: Editor ready, calling onEditorReady.')
        onEditorReady(getCurrentContent)
      }
    }, [editor, onEditorReady, getCurrentContent])

    if (!editor) {
      return <Skeleton className="h-[500px] w-full rounded-lg" />
    }

    return (
      <BlockNoteView
        editor={editor}
        editable={true}
        theme={appTheme}
        sideMenu={false}
        className="h-full rounded-none pl-0"
      />
    )
  },
)

DynamicEditor.displayName = 'DynamicEditor'
// --- End Main Editor Component Logic ---
