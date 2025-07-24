'use client'

import { useEffect } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { CodeEditor } from '@/core/compiler/code-editor'
import { useFileExplorerStore } from '@/core/compiler/code-editor/store/file-explorer-store'
import { useEditorStore } from '@/core/compiler/code-editor/store/editor-store'
import { useEditorTabsStore } from '@/core/compiler/code-editor/store/editor-tabs-store'
import { FileSystemNode } from '@/core/compiler/code-editor/types'
import { FileOutput, Beaker } from 'lucide-react'
import { cn } from '@/lib/utils'

const footerTabs = [
  {
    id: 'output',
    title: 'Output',
    content: <div>Output Content</div>,
    icon: 'file-output',
  },
  {
    id: 'tests',
    title: 'Tests',
    content: <div>Tests Content</div>,
    icon: 'beaker',
  },
]

const fileTree: FileSystemNode[] = [
  {
    id: 'file-1',
    type: 'file' as const,
    name: 'index.js',
    content: "console.log('hello world!')",
    language: 'javascript',
  },
  {
    id: 'folder-1',
    type: 'folder' as const,
    name: 'src',
    children: [
      {
        id: 'file-2',
        type: 'file' as const,
        name: 'app.js',
        content: "import { a } from './utils.js'; console.log(a)",
        language: 'javascript',
      },
      {
        id: 'file-3',
        type: 'file' as const,
        name: 'utils.js',
        content: 'export const a = 1;',
        language: 'javascript',
        locked: true,
      },
    ],
  },
]

export const ChallengeExercice = () => {
  const { isOpen, toggle } = useFileExplorerStore()
  const { setFileTree, setActiveFileId } = useEditorStore()
  const { openTab } = useEditorTabsStore()

  useEffect(() => {
    setFileTree(fileTree)
    setActiveFileId('file-1')
    // Ouvrir automatiquement un onglet pour le fichier actif
    openTab('file-1', 'index.js', 'javascript')
  }, [setFileTree, setActiveFileId, openTab])

  return (
    <CodeEditor.Container>
      <ResizablePanelGroup direction="horizontal" className="relative flex flex-1 overflow-hidden">
        <ResizablePanel
          className={cn(!isOpen && 'hidden')}
          defaultSize={20}
          minSize={15}
          maxSize={40}
        >
          <CodeEditor.FileExplorer />
        </ResizablePanel>
        <ResizableHandle className={cn(!isOpen && 'hidden')} />
        <ResizablePanel defaultSize={80}>
          <CodeEditor.Header.Container>
            <CodeEditor.Header.LeftPart>
              <CodeEditor.Editor.Tabs />
            </CodeEditor.Header.LeftPart>
            <CodeEditor.Header.RightPart>
              <CodeEditor.RunButton />
            </CodeEditor.Header.RightPart>
          </CodeEditor.Header.Container>
          <CodeEditor.FileBreadcrumb />
          <CodeEditor.Editor.Container>
            <CodeEditor.Editor.Content />
          </CodeEditor.Editor.Container>
        </ResizablePanel>
        <CodeEditor.FileSystemButton />
      </ResizablePanelGroup>
      <CodeEditor.Footer tabs={footerTabs} />
    </CodeEditor.Container>
  )
}
