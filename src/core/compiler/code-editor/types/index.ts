import { ReactNode, ElementType } from 'react'

export interface FooterTab {
  id: string
  title: string
  content: ReactNode
  icon: ElementType
}

// Defines a file node in the file system tree
export interface FileNode {
  id: string
  type: 'file'
  name: string
  content: string
  language: string
}

// Defines a folder node in the file system tree
export interface FolderNode {
  id: string
  type: 'folder'
  name: string
  children: FileSystemNode[]
}

// Represents a node in the file system, which can be either a file or a folder
export type FileSystemNode = FileNode | FolderNode
