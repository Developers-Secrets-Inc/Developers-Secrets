'use client'

import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { Tree, TreeItem, TreeItemLabel } from '@/components/tree'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { hotkeysCoreFeature, syncDataLoaderFeature } from '@headless-tree/core'
import { useTree } from '@headless-tree/react'
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  FileIcon,
  FilePlus,
  FolderIcon,
  FolderOpenIcon,
  FolderPlus,
  Lock
} from 'lucide-react'
import React from 'react'
import { useEditorStore } from '../store/editor-store'
import { useFileExplorerStore } from '../store/file-explorer-store'
import { useEditorTabsStore } from '../store/editor-tabs-store'
import { FileSystemNode } from '../types'
import { cn } from '@/lib/utils'

const indent = 20

export const FileExplorerTrigger = () => {
  const { isOpen, toggle } = useFileExplorerStore()
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="size-7 absolute bottom-2 left-2 z-50"
            onClick={toggle}
          >
            {isOpen ? (
              <ArrowRightToLine className="h-4 w-4" />
            ) : (
              <ArrowLeftToLine className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContentCustom side="top">
          {isOpen ? 'Close File Tree' : 'Open File Tree'}
        </TooltipContentCustom>
      </Tooltip>
    </TooltipProvider>
  )
}

export function FileExplorer() {
  const { fileTree, activeFileId, setActiveFileId, addFile, addFolder, isNodeLocked, canModifyNode } = useEditorStore()
  const { openTab, replaceActiveTab, openTabs } = useEditorTabsStore()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [createType, setCreateType] = React.useState<'file' | 'folder' | null>(null)
  const [parentId, setParentId] = React.useState<string | null>(null)
  const [name, setName] = React.useState('')

  // External state management for tree re-rendering
  const [expandedItems, setExpandedItems] = React.useState<string[]>(['root'])
  const [focusedItem, setFocusedItem] = React.useState<string | null>(null)

  // Create a flat map of all nodes for easy lookup
  const items = React.useMemo(() => {
    const flatTree: Record<string, FileSystemNode> = {}
    function traverse(nodes: FileSystemNode[]) {
      for (const node of nodes) {
        flatTree[node.id] = node
        if (node.type === 'folder') {
          traverse(node.children)
        }
      }
    }
    if (fileTree && fileTree.length > 0) {
      traverse(fileTree)
    }
    return flatTree
  }, [fileTree])


  // Fonction utilitaire pour déterminer le langage basé sur l'extension
  const getLanguageFromExtension = (extension: string): string => {
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'tsx': 'typescript',
      'py': 'python',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown',
      'txt': 'plaintext',
    }
    return languageMap[extension.toLowerCase()] || 'plaintext'
  }

  // Gestionnaire pour les clics sur les fichiers
  const handleFileClick = (event: React.MouseEvent, item: any) => {
    if (!item.isFolder()) {
      const fileData = item.getItemData()
      const fileExtension = fileData.name.split('.').pop() || ''
      const language = getLanguageFromExtension(fileExtension)
      
      if (event.button === 1) { // Clic molette
        event.preventDefault()
        openTab(item.getId(), fileData.name, language)
        setActiveFileId(item.getId())
      }
    }
  }

  const handleOpenDialog = (type: 'file' | 'folder', parentId: string) => {
    setCreateType(type)
    setParentId(parentId)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    if (name && createType && parentId) {
      // Vérifier si le parent peut être modifié
      if (parentId !== 'root' && !canModifyNode(parentId)) {
        // Afficher un message d'erreur ou ne rien faire
        console.warn('Cannot create in locked folder')
        setDialogOpen(false)
        setName('')
        setCreateType(null)
        setParentId(null)
        return
      }
      
      if (createType === 'file') {
        addFile(parentId, name)
      } else {
        addFolder(parentId, name)
      }
    }
    setDialogOpen(false)
    setName('')
    setCreateType(null)
    setParentId(null)
  }

  const tree = useTree<FileSystemNode>({
    indent,
    rootItemId: 'root',
    state: { expandedItems, focusedItem },
    setExpandedItems,
    setFocusedItem,
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => item.getItemData().type === 'folder',
    dataLoader: {
      getItem: (itemId) => {
        if (itemId === 'root') {
          return {
            id: 'root',
            name: 'root',
            type: 'folder',
            children: fileTree || [],
          } as FileSystemNode
        }
        return items[itemId]
      },
      getChildren: (itemId) => {
        if (itemId === 'root') {
          return fileTree ? fileTree.map((node) => node.id) : []
        }
        const item = items[itemId]
        if (item?.type === 'folder') {
          return item.children.map((child) => child.id)
        }
        return []
      },
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
    onPrimaryAction: (item) => {
      if (!item.isFolder()) {
        const fileData = item.getItemData()
        const fileExtension = fileData.name.split('.').pop() || ''
        const language = getLanguageFromExtension(fileExtension)
        
        // Clic gauche : remplace l'onglet actuel
        replaceActiveTab(item.getId(), fileData.name, language)
        setActiveFileId(item.getId())
      }
    },
  })

  // Rebuild tree when fileTree changes (for synchronous trees)
  React.useEffect(() => {
    if (fileTree && fileTree.length > 0) {
      tree.rebuildTree()
    }
  }, [fileTree, tree])


  // Ne pas rendre le composant si fileTree est vide
  if (!fileTree || fileTree.length === 0) {
    return (
      <div className="flex h-full flex-col gap-2 items-center justify-center text-muted-foreground">
        <div className="text-sm">No files or folders</div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between border-b h-12 border-border p-2 text-muted-foreground">
        <span className="text-sm font-medium">Explorer</span>
        <div className="flex items-center gap-0.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => handleOpenDialog('file', 'root')}
                >
                  <FilePlus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContentCustom side="bottom">
                <p>New File</p>
              </TooltipContentCustom>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => handleOpenDialog('folder', 'root')}
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContentCustom side="bottom">
                <p>New Folder</p>
              </TooltipContentCustom>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <ContextMenu>
        <ContextMenuTrigger className="h-full w-full">
          <div className="h-full w-full overflow-y-auto bg-background p-2">
            <div className="flex h-full flex-col gap-2">
              <div>
                <Tree
                  className="relative before:absolute before:inset-0 before:-ms-1 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
                  indent={indent}
                  tree={tree}
                >
                  {tree
                    .getItems()
                    .filter((item) => item.getId() !== 'root')
                    .map((item) => {
                      const isFolder = item.isFolder()

                      if (isFolder) {
                        const folderData = item.getItemData()
                        const isFolderLocked = folderData.locked || false
                        const canModifyFolder = canModifyNode(item.getId())
                        
                        return (
                          <ContextMenu key={item.getId()}>
                            <ContextMenuTrigger>
                              <TreeItem item={item} className='w-full'>
                                <TreeItemLabel className="relative before:absolute before:inset-x-0 before:-z-10 before:bg-background">
                                  <span className="-order-1 flex flex-1 items-center gap-2">
                                    {item.isExpanded() ? (
                                      <FolderOpenIcon className="pointer-events-none size-4 text-muted-foreground" />
                                    ) : (
                                      <FolderIcon className="pointer-events-none size-4 text-muted-foreground" />
                                    )}
                                    {item.getItemName()}
                                    {isFolderLocked && (
                                      <Lock className="size-3 text-muted-foreground ml-1" />
                                    )}
                                  </span>
                                </TreeItemLabel>
                              </TreeItem>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                              {canModifyFolder && (
                                <>
                                  <ContextMenuItem
                                    onClick={() => handleOpenDialog('file', item.getId())}
                                  >
                                    <FilePlus className="mr-2 h-4 w-4" />
                                    <span>New File</span>
                                  </ContextMenuItem>
                                  <ContextMenuItem
                                    onClick={() => handleOpenDialog('folder', item.getId())}
                                  >
                                    <FolderPlus className="mr-2 h-4 w-4" />
                                    <span>New Folder</span>
                                  </ContextMenuItem>
                                </>
                              )}
                              {!canModifyFolder && (
                                <ContextMenuItem disabled>
                                  <Lock className="mr-2 h-4 w-4" />
                                  <span>Folder is locked</span>
                                </ContextMenuItem>
                              )}
                            </ContextMenuContent>
                          </ContextMenu>
                        )
                      }
                      const fileData = item.getItemData()
                      const isFileLocked = fileData.locked || false
                      const isFileOpen = openTabs.some(tab => tab.fileId === item.getId())
                      const isActiveFile = activeFileId === item.getId()
                      
                      return (
                        <TreeItem 
                          key={item.getId()} 
                          item={item}
                          onMouseDown={(e) => handleFileClick(e, item)}
                        >
                          <TreeItemLabel className={cn(
                            "before:bg-background relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10",
                            isActiveFile && "bg-primary/5 border border-primary/10 text-primary",
                            isFileOpen && !isActiveFile && "bg-muted/50 border border-muted/10 text-muted-foreground "
                          )}>
                            <span className="-order-1 flex flex-1 items-center gap-2">
                              <FileIcon className={cn(
                                "pointer-events-none size-4",
                                isActiveFile ? "text-primary" : "text-muted-foreground"
                              )} />
                              {item.getItemName()}
                              {isFileLocked && (
                                <Lock className={cn(
                                  'w-3 h-3 ml-auto',
                                  isActiveFile ? "text-primary" : "text-muted-foreground"
                                )} />
                              )}
                              {isFileOpen && !isFileLocked && (
                                <div className={cn(
                                  "w-1.5 h-1.5 rounded-full ml-auto",
                                  isActiveFile ? "bg-primary" : "bg-muted-foreground"
                                )} />
                              )}
                            </span>
                          </TreeItemLabel>
                        </TreeItem>
                      )
                    })}
                </Tree>
              </div>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => handleOpenDialog('file', 'root')}>
            <FilePlus className="mr-2 h-4 w-4" />
            <span>New File</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleOpenDialog('folder', 'root')}>
            <FolderPlus className="mr-2 h-4 w-4" />
            <span>New Folder</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create {createType}</DialogTitle>
          </DialogHeader>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Enter ${createType} name`}
          />
          <DialogFooter>
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
