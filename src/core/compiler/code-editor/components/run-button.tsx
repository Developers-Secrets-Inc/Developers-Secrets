'use client'

import { Button } from '@/components/ui/button'
import { Loader2, Play } from 'lucide-react'
import { useRunCode } from '../../hooks/use-run-code'
import { useEditorStore } from '../store/editor-store'
import { useFooterStore } from '../store/footer-store'
import { transformFileTreeToExecutionStructure } from '../../utils/file-structure'
import { FileSystemNode } from '../types'

const LoadingIcon = ({
  isLoading,
  children,
}: {
  isLoading: boolean
  children: React.ReactNode
}) => {
  return isLoading ? <Loader2 size={14} className="mr-1 animate-spin" /> : children
}



export const RunCodeButton = () => {
  const { fileTree } = useEditorStore()
  const { runFileStructure, isLoadingRun } = useRunCode()
  const { setExecutionOutput, openOutputTab } = useFooterStore()

  const handleRun = async () => {
    try {
      if (!fileTree || fileTree.length === 0) {
        console.log('Aucune structure de fichiers à exécuter')
        setExecutionOutput('Aucune structure de fichiers à exécuter')
        openOutputTab()
        return
      }
      
      // Transform to execution structure directly from FileSystemNode[]
      const executionStructure = transformFileTreeToExecutionStructure(fileTree)
      
      console.log('Structure de fichiers:', fileTree)
      console.log('Structure d\'exécution:', executionStructure)
      
      // Execute the file structure
      const result = await runFileStructure(executionStructure)
      console.log('Résultat de l\'exécution:', result)
      
      // Store the execution result and open the output tab
      if (result) {
        setExecutionOutput(result)
        openOutputTab()
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'exécution:', error)
      setExecutionOutput(`Erreur lors de l'exécution: ${error}`)
      openOutputTab()
    }
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      className="h-8"
      onClick={handleRun}
      disabled={isLoadingRun}
    >
      <LoadingIcon isLoading={isLoadingRun}>
        <Play size={14} className="mr-1" />
      </LoadingIcon>
      Run
    </Button>
  )
}
