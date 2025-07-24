'use client'

import { cn } from '@/lib/utils'
import { Editor, OnMount } from '@monaco-editor/react'
import { useRef, useMemo, useEffect } from 'react'
import { useEditorStore } from '../store/editor-store'
import { useEditorTabsStore } from '../store/editor-tabs-store'
import { useFooterStore } from '../store/footer-store'
import { FileSystemNode } from '../types'
import { EmptyState } from './empty-state'
import { FileText, Code, FolderOpen } from 'lucide-react'

type ChallengeEditorProps = {
  onChange?: (code: string) => void
}

// Utility function to find a file node by ID in the file tree
const findFileById = (nodes: FileSystemNode[], id: string): FileSystemNode | null => {
  for (const node of nodes) {
    if (node.id === id) {
      return node
    }
    if (node.type === 'folder') {
      const found = findFileById(node.children, id)
      if (found) return found
    }
  }
  return null
}

export const ChallengeEditor = ({ onChange }: ChallengeEditorProps) => {
  const { fileTree, activeFileId, updateNodeContent, setActiveFileId } = useEditorStore()
  const { openTabs, activeTabId, setActiveTab } = useEditorTabsStore()
  const editorRef = useRef<unknown>(null)

  // Find the active file in the file tree
  const activeFile = useMemo(() => {
    if (!activeFileId || !fileTree) return null
    return findFileById(fileTree, activeFileId)
  }, [activeFileId, fileTree])

  // Synchroniser l'onglet actif avec le fichier actif
  useEffect(() => {
    if (activeFileId) {
      const correspondingTab = openTabs.find(tab => tab.fileId === activeFileId)
      if (correspondingTab) {
        setActiveTab(correspondingTab.id)
      }
    }
  }, [activeFileId, openTabs, setActiveTab])

  // Synchroniser le fichier actif avec l'onglet actif
  useEffect(() => {
    if (activeTabId === null) {
      setActiveFileId(null)
    }
  }, [activeTabId, setActiveFileId])

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      // Update the content in the store if there's an active file
      if (activeFileId) {
        updateNodeContent(activeFileId, value)
      }
      onChange?.(value)
    }
  }

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1a1b26',
      },
    })
    monaco.editor.setTheme('custom-dark')
    editor.focus()
  }

  // Show a placeholder if no file is selected
  if (!activeFile) {
    return (
      <div className="flex h-full items-center justify-center p-2">
        <EmptyState
          title="No file selected"
          description="Select a file from the explorer to start editing"
          icons={[FileText, Code, FolderOpen]}
        />
      </div>
    )
  }

  // Only render editor if activeFile is a file (not a folder)
  if (activeFile.type !== 'file') {
    return (
      <div className="flex h-full items-center justify-center p-2">
        <EmptyState
          title="No file selected"
          description="Select a file from the explorer to start editing"
          icons={[FileText, Code, FolderOpen]}
        />
      </div>
    )
  }

  return (
    <Editor
      height="100%"
      language={activeFile.language || 'plaintext'}
      value={activeFile.content || ''}
      onChange={handleCodeChange}
      theme="vs-dark"
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
        tabSize: activeFile.language === 'python' ? 4 : 2,
        automaticLayout: true,
        wordWrap: 'on',
        lineNumbers: 'on',
        glyphMargin: true,
        folding: true,
        lineDecorationsWidth: 10,
        bracketPairColorization: { enabled: true },
      }}
    />
  )
}


export const ChallengeEditorContainer = ({ children }: { children: React.ReactNode }) => {

  return (
    <div
      className={cn(
        'relative flex-grow transition-all duration-300 ease-in-out h-full',
      )}
    >
      {children}
    </div>
  )
}