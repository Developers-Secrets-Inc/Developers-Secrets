import { useEffect, useCallback } from 'react'
import { useStoreReset } from '@/api/challenges/hooks/use-store-reset'
import { useEditorStore } from '@/core/compiler/code-editor/store/editor-store'
import { useEditorTabsStore } from '@/core/compiler/code-editor/store/editor-tabs-store'
import { useFooterStore } from '@/core/compiler/code-editor/store/footer-store'
import { useFileExplorerStore } from '@/core/compiler/code-editor/store/file-explorer-store'
import { AiExercice, Exercice } from '@/payload-types'
import { FileSystemNode } from '@/core/compiler/code-editor/types'

// Types pour la structure de fichiers (aligné avec challenge)
type FileStructureItem = {
  id?: string | null
  type: 'file' | 'folder'
  name: string
  parentId?: string | null
  language?: ('python' | 'javascript' | 'typescript' | 'html' | 'css' | 'json' | 'markdown' | 'text') | null
  content?: string | null
  isReadOnly?: boolean | null
  isHidden?: boolean | null
  isMainFile?: boolean | null
}

/**
 * Hook qui gère le cycle de vie complet d'un part de cours
 * Réinitialise et initialise l'éditeur de façon coordonnée
 */
export const useCoursePartLifecycle = (exercice: Exercice | AiExercice) => {
  const { resetAllStores } = useStoreReset()
  const { setFileTree, setActiveFileId } = useEditorStore()
  const { openTab } = useEditorTabsStore()

  // Fonctions utilitaires (similaires à challenge)
  const getFileStructureForLanguage = useCallback((exercice: Exercice | AiExercice, language: string): FileStructureItem[] => {
    const languageData = exercice.languages?.find((lang) => lang.language === language)
    return languageData?.fileStructure || []
  }, [])

  const getDefaultLanguage = useCallback((exercice: Exercice | AiExercice): string => {
    if (exercice.languages && exercice.languages.length > 0) {
      return exercice.languages[0].language || 'javascript'
    }
    return 'javascript'
  }, [])

  const transformFileStructureToFileTree = useCallback((fileStructure: FileStructureItem[]): FileSystemNode[] => {
    const nodeMap = new Map<string, FileSystemNode>()
    const rootNodes: FileSystemNode[] = []

    // Première passe : création des noeuds
    fileStructure.forEach((item) => {
      if (!item.id) return
      let node: FileSystemNode
      if (item.type === 'file') {
        node = {
          id: item.id,
          name: item.name,
          type: 'file',
          content: item.content || '',
          language: item.language || 'text',
          locked: item.isReadOnly || false,
        }
      } else {
        node = {
          id: item.id,
          name: item.name,
          type: 'folder',
          children: [],
          locked: item.isReadOnly || false,
        }
      }
      nodeMap.set(item.id, node)
    })

    // Deuxième passe : construction de l'arbre
    fileStructure.forEach((item) => {
      if (!item.id) return
      const node = nodeMap.get(item.id)
      if (!node) return
      if (item.parentId) {
        const parent = nodeMap.get(item.parentId)
        if (parent && parent.type === 'folder') {
          parent.children.push(node)
        }
      } else {
        rootNodes.push(node)
      }
    })
    return rootNodes
  }, [])

  const findMainFile = useCallback((fileStructure: FileStructureItem[]): string | null => {
    const mainFile = fileStructure.find((item) => item.isMainFile && item.type === 'file')
    return mainFile?.id || null
  }, [])

  const findFirstFile = useCallback((fileTree: FileSystemNode[]): FileSystemNode | null => {
    for (const node of fileTree) {
      if (node.type === 'file') {
        return node
      }
      if (node.type === 'folder' && node.children.length > 0) {
        const found = findFirstFile(node.children)
        if (found) return found
      }
    }
    return null
  }, [])

  const initializeEditor = useCallback((exercice: Exercice | AiExercice) => {
    const defaultLanguage = getDefaultLanguage(exercice)
    const fileStructure = getFileStructureForLanguage(exercice, defaultLanguage)
    const transformedFileTree = transformFileStructureToFileTree(fileStructure)
    setFileTree(transformedFileTree)
    const mainFileId = findMainFile(fileStructure)
    if (mainFileId) {
      const mainFile = fileStructure.find((item) => item.id === mainFileId)
      if (mainFile && mainFile.language) {
        setActiveFileId(mainFileId)
        openTab(mainFileId, mainFile.name, mainFile.language)
      }
    } else if (transformedFileTree.length > 0) {
      const firstFile = findFirstFile(transformedFileTree)
      if (firstFile && firstFile.type === 'file') {
        setActiveFileId(firstFile.id)
        openTab(firstFile.id, firstFile.name, firstFile.language)
      }
    }
  }, [setFileTree, setActiveFileId, openTab, getDefaultLanguage, getFileStructureForLanguage, transformFileStructureToFileTree, findMainFile, findFirstFile])

  useEffect(() => {
    resetAllStores()
    initializeEditor(exercice)
  }, [exercice.id, resetAllStores, initializeEditor])

  return {
    resetAllStores,
    initializeEditor
  }
}