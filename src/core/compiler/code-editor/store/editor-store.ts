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

// Zustand store for managing the editor's state
export const useEditorStore = create<EditorState & EditorActions>((set) => ({
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
}))
