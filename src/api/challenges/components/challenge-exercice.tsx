'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { CodeEditor } from '@/core/compiler/code-editor'
import { useFileExplorerStore } from '@/core/compiler/code-editor/store/file-explorer-store'
import { cn } from '@/lib/utils'
import { AiExercice, Exercice } from '@/payload-types'
import { OutputContent } from '@/core/compiler/code-editor/components/output-content'
import { SubmitButton } from './submit-button'
import { SubmitButton as AISubmitButton } from '@/api/exercices/ai/components/ai-exercice-submit-button'
import { TestResults } from '../submissions/components/test-results'
import { useChallengeLifecycle } from '@/api/challenges/hooks/use-challenge-lifecycle'

// Fonction pour créer les onglets du footer avec les tests de l'exercice
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

export const ChallengeExercice = ({ exercice }: { exercice: Exercice | AiExercice }) => {
  const { isOpen } = useFileExplorerStore()
  
  // Use the challenge lifecycle hook to manage editor initialization
  useChallengeLifecycle(exercice)

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
              {'prompts' in exercice ? <AISubmitButton /> : <SubmitButton />}
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
