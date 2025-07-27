import { FileSystemNode, FileNode, FolderNode } from '../code-editor/types'

/**
 * File information for execution
 */
export interface FileInfo {
  path: string
  content: string
  language?: string
}

/**
 * File structure for execution with Pyodide
 */
export interface FileStructureForExecution {
  files: FileInfo[]
  mainFile: FileInfo | null
  workingDirectory: string
}

/**
 * Transforms a file tree into an execution structure
 * @param fileTree - The file tree to transform
 * @param basePath - The base path (default '/')
 * @returns The execution structure
 */
export function transformFileTreeToExecutionStructure(
  fileTree: FileSystemNode[],
  basePath: string = '/',
): FileStructureForExecution {
  const files = flattenFileStructure(fileTree, basePath)
  const mainFile = findMainFile(files)

  return {
    files,
    mainFile,
    workingDirectory: basePath,
  }
}

/**
 * Recursively flattens the file structure
 * @param nodes - The nodes to flatten
 * @param currentPath - The current path
 * @returns The flattened file list
 */
export function flattenFileStructure(
  nodes: FileSystemNode[],
  currentPath: string = '/',
): FileInfo[] {
  const files: FileInfo[] = []

  for (const node of nodes) {
    const nodePath = generateFilePath(currentPath, node.name)

    if (node.type === 'file') {
      const fileNode = node as FileNode
      files.push({
        path: nodePath,
        content: fileNode.content || '',
        language: fileNode.language,
      })
    } else if (node.type === 'folder') {
      const folderNode = node as FolderNode
      if (folderNode.children && folderNode.children.length > 0) {
        files.push(...flattenFileStructure(folderNode.children, nodePath))
      }
    }
  }

  return files
}

/**
 * Generates a correct file path
 * @param basePath - The base path
 * @param fileName - The file name
 * @returns The complete path
 */
export function generateFilePath(basePath: string, fileName: string): string {
  // Normalize the base path
  const normalizedBase = basePath.endsWith('/') ? basePath : basePath + '/'

  // Avoid double slashes
  if (normalizedBase === '/') {
    return '/' + fileName
  }

  return normalizedBase + fileName
}

/**
 * Finds the main file in the file list
 * @param files - The file list
 * @returns The main file or null if not found
 */
export function findMainFile(files: FileInfo[]): FileInfo | null {
  // Priority 1: Look for a file named 'main.*'
  const mainFile = files.find((file) => {
    const fileName = file.path.split('/').pop() || ''
    return fileName.startsWith('main.')
  })

  if (mainFile) {
    return mainFile
  }

  // Priority 2: Look for common entry files
  const entryFiles = ['index.py', 'app.py', 'run.py', 'start.py']
  for (const entryFileName of entryFiles) {
    const entryFile = files.find((file) => {
      const fileName = file.path.split('/').pop() || ''
      return fileName === entryFileName
    })

    if (entryFile) {
      return entryFile
    }
  }

  // Priority 3: First Python file found
  const pythonFile = files.find((file) => {
    const fileName = file.path.split('/').pop() || ''
    return fileName.endsWith('.py')
  })

  if (pythonFile) {
    return pythonFile
  }

  // Priority 4: First file with content
  const fileWithContent = files.find((file) => file.content.trim().length > 0)

  return fileWithContent || null
}
