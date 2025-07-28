import { create } from 'zustand'
import { FileSystemNode } from '../types'

// Defines the state of the editor store
interface EditorState {
  fileTree: FileSystemNode[]
  activeFileId: string | null
}

// Defines the actions available on the editor store
interface EditorActions {
  setFileTree: (fileTree: FileSystemNode[]) => void
  setActiveFileId: (id: string | null) => void
  updateNodeContent: (id: string, content: string) => void
  addFile: (parentId: string, fileName: string) => void
  addFolder: (parentId: string, folderName: string) => void
  isNodeLocked: (id: string) => boolean
  isNodeOrParentLocked: (id: string) => boolean
  canModifyNode: (id: string) => boolean
  reset: () => void
}

// Utility function to recursively add a node to the file system tree
const addNodeToTree = (
  nodes: FileSystemNode[],
  parentId: string,
  newNode: FileSystemNode,
): FileSystemNode[] => {
  return nodes.map((node) => {
    if (node.id === parentId && node.type === 'folder') {
      return { ...node, children: [...node.children, newNode] }
    }
    if (node.type === 'folder') {
      return { ...node, children: addNodeToTree(node.children, parentId, newNode) }
    }
    return node
  })
}

// Utility function to recursively update a node in the file system tree
const updateNodeInTree = (
  nodes: FileSystemNode[],
  id: string,
  content: string,
): FileSystemNode[] => {
  return nodes.map((node) => {
    if (node.id === id && node.type === 'file') {
      return { ...node, content }
    }
    if (node.type === 'folder') {
      return { ...node, children: updateNodeInTree(node.children, id, content) }
    }
    return node
  })
}

// Utility function to find a node by ID in the file system tree
const findNodeInTree = (
  nodes: FileSystemNode[],
  id: string,
): FileSystemNode | null => {
  for (const node of nodes) {
    if (node.id === id) {
      return node
    }
    if (node.type === 'folder') {
      const found = findNodeInTree(node.children, id)
      if (found) return found
    }
  }
  return null
}

// Utility function to check if a node or any of its parents are locked
const isNodeOrParentLockedInTree = (
  nodes: FileSystemNode[],
  id: string,
  parentPath: FileSystemNode[] = [],
): boolean => {
  // Check if any parent in the current path is locked
  if (parentPath.some(parent => parent.locked)) {
    return true
  }

  for (const node of nodes) {
    if (node.id === id) {
      // Found the target node, check if it or any parent is locked
      return node.locked || parentPath.some(parent => parent.locked)
    }
    if (node.type === 'folder') {
      const found = isNodeOrParentLockedInTree(node.children, id, [...parentPath, node])
      if (found) return found
    }
  }
  return false
}

// Zustand store for managing the editor's state
export const useEditorStore = create<EditorState & EditorActions>()((set, get) => ({
  fileTree: [],
  activeFileId: null,
  setFileTree: (fileTree) => set({ fileTree }),
  setActiveFileId: (id) => set({ activeFileId: id }),
  updateNodeContent: (id, content) =>
    set((state) => ({
      ...state,
      fileTree: updateNodeInTree(state.fileTree, id, content),
    })),
  addFile: (parentId, fileName) =>
    set((state) => {
      const getLanguage = (fileName: string) => {
        const extension = fileName.split('.').pop()
        switch (extension) {
          case 'ts':
          case 'tsx':
            return 'typescript'
          case 'js':
          case 'jsx':
            return 'javascript'
          case 'css':
            return 'css'
          case 'json':
            return 'json'
          case 'md':
            return 'markdown'
          default:
            return 'plaintext'
        }
      }

      const newFile: FileSystemNode = {
        id: crypto.randomUUID(),
        name: fileName,
        type: 'file',
        content: '',
        language: getLanguage(fileName),
      }
      if (parentId === 'root') {
        return { fileTree: [...state.fileTree, newFile] }
      }
      return { fileTree: addNodeToTree(state.fileTree, parentId, newFile) }
    }),
  addFolder: (parentId, folderName) =>
    set((state) => {
      const newFolder: FileSystemNode = {
        id: crypto.randomUUID(),
        name: folderName,
        type: 'folder',
        children: [],
      }
      if (parentId === 'root') {
        return { fileTree: [...state.fileTree, newFolder] }
      }
      return { fileTree: addNodeToTree(state.fileTree, parentId, newFolder) }
    }),
  isNodeLocked: (id: string): boolean => {
    const state = get()
    const node = findNodeInTree(state.fileTree, id)
    return node?.locked || false
  },
  isNodeOrParentLocked: (id: string): boolean => {
    const state = get()
    return isNodeOrParentLockedInTree(state.fileTree, id)
  },
  canModifyNode: (id: string): boolean => {
    const state = get()
    return !isNodeOrParentLockedInTree(state.fileTree, id)
  },
  reset: () => set({ fileTree: [], activeFileId: null }),
}))
