import { useMemo } from 'react'
import { useEditorStore } from '../store/editor-store'
import { buildBreadcrumbPath, truncateBreadcrumbPath, BreadcrumbItem } from '../utils/breadcrumb-utils'

export interface UseBreadcrumbOptions {
  maxItems?: number
  truncate?: boolean
}

/**
 * Hook personnalisé pour gérer le breadcrumb du fichier actif
 * @param options - Options de configuration du breadcrumb
 * @returns Les éléments de breadcrumb pour le fichier actif
 */
export function useBreadcrumb(options: UseBreadcrumbOptions = {}): BreadcrumbItem[] {
  const { maxItems = 4, truncate = true } = options
  const { activeFileId, fileTree } = useEditorStore()
  
  const breadcrumbItems = useMemo(() => {
    if (!activeFileId || !fileTree) {
      return []
    }
    
    const path = buildBreadcrumbPath(activeFileId, fileTree)
    
    if (truncate && path.length > maxItems) {
      return truncateBreadcrumbPath(path, maxItems)
    }
    
    return path
  }, [activeFileId, fileTree, maxItems, truncate])
  
  return breadcrumbItems
}

/**
 * Hook pour obtenir le fichier actuel sans breadcrumb
 * @returns Le fichier actuellement actif ou null
 */
export function useActiveFile() {
  const { activeFileId, fileTree } = useEditorStore()
  
  const activeFile = useMemo(() => {
    if (!activeFileId || !fileTree) {
      return null
    }
    
    function findFileById(nodes: typeof fileTree, id: string): typeof fileTree[0] | null {
      for (const node of nodes) {
        if (node.id === id) {
          return node
        }
        if (node.type === 'folder' && node.children) {
          const found = findFileById(node.children, id)
          if (found) return found
        }
      }
      return null
    }
    
    return findFileById(fileTree, activeFileId)
  }, [activeFileId, fileTree])
  
  return activeFile
}