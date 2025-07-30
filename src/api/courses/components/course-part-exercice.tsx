'use client'

import { useEffect } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { CodeEditor } from '@/core/compiler/code-editor'
import { useFileExplorerStore } from '@/core/compiler/code-editor/store/file-explorer-store'
import { useEditorStore } from '@/core/compiler/code-editor/store/editor-store'
import { useEditorTabsStore } from '@/core/compiler/code-editor/store/editor-tabs-store'
import { FileSystemNode, FileNode, FolderNode } from '@/core/compiler/code-editor/types'
import { FileOutput, Beaker } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AiExercice, CoursePart, Exercice } from '@/payload-types'
import { OutputContent } from '@/core/compiler/code-editor/components/output-content'
import { SubmitButton } from '../submissions/components/submit-button'
import { TestResults } from '../submissions/components/tests-results'
// Types pour la nouvelle structure de fichiers (alignés avec Payload CMS)
type FileStructureItem = {
  id?: string | null
  type: 'file' | 'folder'
  name: string
  parentId?: string | null
  language?:
    | ('python' | 'javascript' | 'typescript' | 'html' | 'css' | 'json' | 'markdown' | 'text')
    | null
  content?: string | null
  isReadOnly?: boolean | null
  isHidden?: boolean | null
  isMainFile?: boolean | null
}

// Fonction pour extraire la structure de fichiers pour un langage donné
function getFileStructureForLanguage(
  exercice: Exercice | AiExercice,
  language: string,
): FileStructureItem[] {
  const languageData = exercice.languages?.find((lang) => lang.language === language)
  return languageData?.fileStructure || []
}

// Fonction pour identifier le fichier principal
function findMainFile(fileStructure: FileStructureItem[]): string | null {
  const mainFile = fileStructure.find((item) => item.type === 'file' && item.isMainFile === true)
  return mainFile?.id || null
}

// Fonction pour transformer la structure plate en arbre hiérarchique
function transformFileStructureToFileTree(fileStructure: FileStructureItem[]): FileSystemNode[] {
  // Filtrer les éléments cachés et ceux sans ID valide
  const visibleItems = fileStructure.filter(
    (item) => item.isHidden !== true && item.id != null && item.id !== '',
  )

  // Fonction récursive pour construire l'arbre
  function buildTree(parentId?: string | null): FileSystemNode[] {
    const itemsForParent = visibleItems.filter((item) => {
      // Gérer les cas où parentId peut être null, undefined ou une chaîne vide
      const itemParentId = item.parentId
      const targetParentId = parentId

      // Si les deux sont null/undefined, ils correspondent
      if (
        (itemParentId == null || itemParentId === '') &&
        (targetParentId == null || targetParentId === '')
      ) {
        return true
      }

      // Sinon, comparaison directe
      return itemParentId === targetParentId
    })

    return itemsForParent.map((item) => {
      const itemId = item.id || `generated-${Math.random().toString(36).substr(2, 9)}`

      if (item.type === 'folder') {
        return {
          id: itemId,
          type: 'folder' as const,
          name: item.name,
          children: buildTree(itemId),
        } as FolderNode
      } else {
        return {
          id: itemId,
          type: 'file' as const,
          name: item.name,
          content: item.content || '',
          language: item.language || 'text',
          locked: item.isReadOnly === true,
        } as FileNode
      }
    })
  }

  return buildTree()
}

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

// Fonction pour créer les onglets du footer sans tests (mode par défaut)
const defaultFooterTabs = [
  {
    id: 'output',
    title: 'Output',
    content: <OutputContent />,
    icon: 'file-output',
  },
]
// Fonction pour obtenir le langage par défaut (premier langage disponible)
function getDefaultLanguage(exercice: Exercice | AiExercice): string {
  return exercice.languages?.[0]?.language || 'javascript'
}

const ClassicChallengeExercice = ({ exercice }: { exercice: Exercice }) => {
  const { isOpen, toggle } = useFileExplorerStore()
  const { setFileTree, setActiveFileId } = useEditorStore()
  const { openTab } = useEditorTabsStore()

  useEffect(() => {
    // Obtenir le langage par défaut
    const defaultLanguage = getDefaultLanguage(exercice)

    // Extraire la structure de fichiers pour ce langage
    const fileStructure = getFileStructureForLanguage(exercice, defaultLanguage)

    // Transformer en arbre de fichiers
    const transformedFileTree = transformFileStructureToFileTree(fileStructure)

    // Configurer l'éditeur
    setFileTree(transformedFileTree)

    // Identifier et ouvrir le fichier principal
    const mainFileId = findMainFile(fileStructure)
    if (mainFileId && transformedFileTree.length > 0) {
      const mainFile = fileStructure.find((item) => item.id === mainFileId)
      if (mainFile && mainFile.language) {
        setActiveFileId(mainFileId)
        openTab(mainFileId, mainFile.name, mainFile.language)
      }
    } else if (transformedFileTree.length > 0) {
      // Si pas de fichier principal défini, prendre le premier fichier
      const firstFile = findFirstFile(transformedFileTree)
      if (firstFile && firstFile.type === 'file') {
        setActiveFileId(firstFile.id)
        openTab(firstFile.id, firstFile.name, firstFile.language)
      }
    }
  }, [exercice, setFileTree, setActiveFileId, openTab])

  // Fonction utilitaire pour trouver le premier fichier dans l'arbre
  function findFirstFile(nodes: FileSystemNode[]): FileSystemNode | null {
    for (const node of nodes) {
      if (node.type === 'file') {
        return node
      }
      if (node.type === 'folder' && node.children) {
        const found = findFirstFile(node.children)
        if (found) return found
      }
    }
    return null
  }
  return (
      <CodeEditor.Container>
        <ResizablePanelGroup
          direction="horizontal"
          className="relative flex flex-1 overflow-hidden"
        >
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
        content: '# Write your Python code here\n\nprint("Hello, World!")',
        language: 'python',
        locked: false,
      }
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
      <ResizablePanelGroup
        direction="horizontal"
        className="relative flex flex-1 overflow-hidden"
      >
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

  return <div className='h-full'>{exercicesComponents[exercice.relationTo]}</div>
}
