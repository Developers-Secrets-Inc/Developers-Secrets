'use client'

import { useEffect, useCallback } from 'react'
import { useStoreReset } from './use-store-reset'
import { useEditorStore } from '@/core/compiler/code-editor/store/editor-store'
import { useEditorTabsStore } from '@/core/compiler/code-editor/store/editor-tabs-store'
import { AiExercice, Exercice } from '@/payload-types'
import { FileSystemNode } from '@/core/compiler/code-editor/types'

// Types from challenge-exercice.tsx
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
 * Hook that manages the complete lifecycle of a challenge
 * Handles reset and initialization in a coordinated manner
 */
export const useChallengeLifecycle = (exercice: Exercice | AiExercice) => {
  const { resetAllStores } = useStoreReset()
  const { setFileTree, setActiveFileId } = useEditorStore()
  const { openTab } = useEditorTabsStore()

  // Utility functions (moved from challenge-exercice.tsx)
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

    // First pass: create all nodes
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

    // Second pass: build the tree structure
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

    // Set the file tree in the editor store
    setFileTree(transformedFileTree)

    // Find and set the main file or first file as active
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

  // Coordinated reset and initialization
  useEffect(() => {
    // Reset all stores first
    resetAllStores()
    
    // Then initialize with new data
    initializeEditor(exercice)
  }, [exercice.id, resetAllStores, initializeEditor]) // Depend on exercice.id for challenge changes

  return {
    resetAllStores,
    initializeEditor
  }
}