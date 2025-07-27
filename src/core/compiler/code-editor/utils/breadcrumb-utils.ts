import { FileSystemNode } from '../types'

export interface BreadcrumbItem {
  id: string
  name: string
  type: 'file' | 'folder'
}

/**
 * Construit le chemin de breadcrumb pour un fichier donné dans l'arbre de fichiers
 * @param fileId - L'ID du fichier pour lequel construire le chemin
 * @param tree - L'arbre de fichiers
 * @returns Un tableau d'éléments de breadcrumb représentant le chemin
 */
export function buildBreadcrumbPath(fileId: string, tree: FileSystemNode[]): BreadcrumbItem[] {
  const path: BreadcrumbItem[] = []
  
  function findPath(nodes: FileSystemNode[], targetId: string, currentPath: BreadcrumbItem[]): boolean {
    for (const node of nodes) {
      const newPath = [...currentPath, { id: node.id, name: node.name, type: node.type }]
      
      if (node.id === targetId) {
        path.push(...newPath)
        return true
      }
      
      if (node.type === 'folder' && node.children) {
        if (findPath(node.children, targetId, newPath)) {
          return true
        }
      }
    }
    return false
  }
  
  findPath(tree, fileId, [])
  return path
}

/**
 * Tronque le chemin de breadcrumb si il est trop long
 * @param items - Les éléments de breadcrumb
 * @param maxItems - Le nombre maximum d'éléments à afficher
 * @returns Les éléments tronqués avec ellipsis si nécessaire
 */
export function truncateBreadcrumbPath(items: BreadcrumbItem[], maxItems: number = 4): BreadcrumbItem[] {
  if (items.length <= maxItems) {
    return items
  }
  
  // Garde toujours le premier et le dernier élément
  const first = items[0]
  const last = items[items.length - 1]
  const middle = items.slice(1, -1)
  
  if (maxItems <= 2) {
    return [first, last]
  }
  
  // Calcule combien d'éléments du milieu on peut garder
  const middleCount = maxItems - 2
  const truncatedMiddle = middle.slice(-middleCount)
  
  return [first, ...truncatedMiddle, last]
}