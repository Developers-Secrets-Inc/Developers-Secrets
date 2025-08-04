'use client'

import { useCoursePartLifecycle } from '@/api/courses/hooks/use-course-part-lifecycle'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { CodeEditor } from '@/core/compiler/code-editor'
import { OutputContent } from '@/core/compiler/code-editor/components/output-content'
import { useEditorStore } from '@/core/compiler/code-editor/store/editor-store'
import { useEditorTabsStore } from '@/core/compiler/code-editor/store/editor-tabs-store'
import { useFileExplorerStore } from '@/core/compiler/code-editor/store/file-explorer-store'
import { FileSystemNode } from '@/core/compiler/code-editor/types'
import { cn } from '@/lib/utils'
import { AiExercice, CoursePart, Exercice } from '@/payload-types'
import { useEffect } from 'react'
import { SubmitButton } from '../submissions/components/submit-button'
import { TestResults } from '../submissions/components/tests-results'




const footerTabs = [
  {
    id: 'output',
    title: 'Output',
    content: <OutputContent />,
    icon: 'file-output',
  },
  {
    id: 'tests',
    title: 'Tests',
    content: <TestResults />,
    icon: 'beaker',
  },
]

// Fonction pour créer les onglets du footer sans tests (mode par défaut)
const defaultFooterTabs = [
  {
    id: 'output',
    title: 'Output',
    content: <OutputContent />,
    icon: 'file-output',
  },
]


const ClassicChallengeExercice = ({ exercice }: { exercice: Exercice }) => {
  const { isOpen } = useFileExplorerStore()
  
  useCoursePartLifecycle(exercice)


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
              <SubmitButton />
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

const AIChallengeExercice = ({ exercice }: { exercice: AiExercice }) => {
  return <div>AI Exercice Component</div>
}

const DefaultCodeEditor = () => {
  const { isOpen, toggle } = useFileExplorerStore()
  const { setFileTree, setActiveFileId } = useEditorStore()
  const { openTab } = useEditorTabsStore()

  useEffect(() => {
    // Créer une structure de fichiers par défaut avec main.py
    const defaultFileTree: FileSystemNode[] = [
      {
        id: 'main-py',
        type: 'file',
        name: 'main.py',
        content: '# Write your code here',
        language: 'python',
        locked: false,
      },
    ]

    // Configurer l'éditeur avec le fichier par défaut
    setFileTree(defaultFileTree)
    setActiveFileId('main-py')
    openTab('main-py', 'main.py', 'python')

    // Fermer l'explorateur de fichiers (pas nécessaire pour un seul fichier)
    if (isOpen) {
      toggle()
    }
  }, [setFileTree, setActiveFileId, openTab, isOpen, toggle])

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
              {/* Pas de SubmitButton dans le mode par défaut */}
            </CodeEditor.Header.RightPart>
          </CodeEditor.Header.Container>
          <CodeEditor.FileBreadcrumb />
          <CodeEditor.Editor.Container>
            <CodeEditor.Editor.Content />
          </CodeEditor.Editor.Container>
        </ResizablePanel>
        <CodeEditor.FileSystemButton />
      </ResizablePanelGroup>
      <CodeEditor.Footer tabs={defaultFooterTabs} />
    </CodeEditor.Container>
  )
}

export const CoursePartExercice = ({ exercice }: { exercice: CoursePart['exercice'] }) => {
  if (!exercice) {
    return <DefaultCodeEditor />
  }

  const exercicesComponents: Record<string, React.ReactNode> = {
    exercices: (
      <ClassicChallengeExercice
        exercice={
          exercice.relationTo === 'exercices' ? (exercice.value as Exercice) : ({} as Exercice)
        }
      />
    ),
    'ai-exercices': (
      <AIChallengeExercice
        exercice={
          exercice.relationTo === 'ai-exercices'
            ? (exercice.value as AiExercice)
            : ({} as AiExercice)
        }
      />
    ),
  }

  return <div className="h-full">{exercicesComponents[exercice.relationTo]}</div>
}
