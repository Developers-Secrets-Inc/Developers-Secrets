'use client'

import React from 'react'
import { hotkeysCoreFeature, syncDataLoaderFeature, TreeState } from '@headless-tree/core'
import { useTree } from '@headless-tree/react'
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  FileIcon,
  FilePlus,
  FolderIcon,
  FolderOpenIcon,
  FolderPlus,
  ListIcon,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Tree, TreeItem, TreeItemLabel } from '@/components/tree'
import { useEditorStore } from '../store/editor-store'
import { FileSystemNode } from '../types'
import { useFileExplorerStore } from '../store/file-explorer-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const indent = 20

const ROOT_ID = 'root'

// export const FileExplorer = () => {
//   const [dialogOpen, setDialogOpen] = React.useState(false)
//   const [createType, setCreateType] = React.useState<'file' | 'folder' | null>(null)
//   const [parentId, setParentId] = React.useState<string | null>(null)
//   const [name, setName] = React.useState('')
//   const [state, setState] = React.useState<Partial<TreeState<FileSystemNode>>>({});
//   const [dataLoaderKey, setDataLoaderKey] = React.useState(0);
//   const { fileTree, setActiveFileId, addFile, addFolder } = useEditorStore()

//   // Force re-sync when fileTree changes
//   React.useEffect(() => {
//     setDataLoaderKey(prev => prev + 1);
//     // Reset tree state to ensure clean re-render
//     setState({});
//   }, [fileTree]);

//   const items = React.useMemo(() => {
//     const flatTree: Record<string, FileSystemNode> = {}
//     function traverse(nodes: FileSystemNode[]) {
//       for (const node of nodes) {
//         flatTree[node.id] = node
//         if (node.type === 'folder') {
//           traverse(node.children)
//         }
//       }
//     }
//     traverse(fileTree)
//     return flatTree
//   }, [fileTree])

//   const handleOpenDialog = (type: 'file' | 'folder', parentId: string) => {
//     setCreateType(type)
//     setParentId(parentId)
//     setDialogOpen(true)
//   }

//   const handleCreate = () => {
//     if (name && createType && parentId) {
//       if (createType === 'file') {
//         addFile(parentId, name)
//       } else {
//         addFolder(parentId, name)
//       }
//     }
//     setDialogOpen(false)
//     setName('')
//     setCreateType(null)
//     setParentId(null)
//   }

//   const dataLoader = React.useMemo(
//     () => ({
//       getItem: (itemId: string) => {
//         if (itemId === ROOT_ID) {
//           return {
//             id: ROOT_ID,
//             name: 'root',
//             type: 'folder',
//             children: fileTree,
//           } as FileSystemNode
//         }
//         return items[itemId]
//       },
//       getChildren: (itemId: string) => {
//         if (itemId === ROOT_ID) {
//           return fileTree.map((node) => node.id)
//         }
//         const item = items[itemId]
//         if (item?.type === 'folder') {
//           return item.children.map((child) => child.id)
//         }
//         return []
//       },
//     }),
//     [fileTree, items, dataLoaderKey],
//   )

//   const tree = useTree<FileSystemNode>({
//     state,
//     setState,
//     indent,
//     rootItemId: ROOT_ID,
//     getItemName: (item) => item.getItemData().name,
//     isItemFolder: (item) => item.getItemData().type === 'folder',
//     dataLoader,
//     features: [syncDataLoaderFeature, hotkeysCoreFeature],
//     onPrimaryAction: (item) => {
//       if (!item.isFolder()) {
//         setActiveFileId(item.getId())
//       }
//     },
//   })

//   return (
//     <>
//       <div className="flex flex-row items-center justify-between border-b border-border p-2 text-muted-foreground">
//         <span className="text-sm font-medium">Explorer</span>
//         <div className="flex items-center gap-2">
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="size-7"
//                   onClick={() => handleOpenDialog('file', ROOT_ID)}
//                 >
//                   <FilePlus className="h-4 w-4" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContentCustom side="bottom">
//                 <p>New File</p>
//               </TooltipContentCustom>
//             </Tooltip>
//           </TooltipProvider>
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="size-7"
//                   onClick={() => handleOpenDialog('folder', ROOT_ID)}
//                 >
//                   <FolderPlus className="h-4 w-4" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContentCustom side="bottom">
//                 <p>New Folder</p>
//               </TooltipContentCustom>
//             </Tooltip>
//           </TooltipProvider>
//         </div>
//       </div>
//       <ContextMenu>
//         <ContextMenuTrigger className="h-full w-full">
//           <div className="h-full w-full overflow-y-auto bg-background p-4">
//             <div className="flex h-full flex-col gap-2">
//               <div>
//                 <Tree
//                   key={dataLoaderKey}
//                   className="relative before:absolute before:inset-0 before:-ms-1 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
//                   indent={indent}
//                   tree={tree}
//                 >
//                   {tree
//                     .getItems()
//                     .filter((item) => item.getId() !== ROOT_ID)
//                     .map((item) => {
//                       const isFolder = item.isFolder()

//                       if (isFolder) {
//                         return (
//                           <ContextMenu key={item.getId()}>
//                             <ContextMenuTrigger>
//                               <TreeItem item={item}>
//                                 <TreeItemLabel className="relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10 before:bg-background">
//                                   <span className="flex items-center gap-2">
//                                     {item.isExpanded() ? (
//                                       <FolderOpenIcon className="pointer-events-none size-4 text-muted-foreground" />
//                                     ) : (
//                                       <FolderIcon className="pointer-events-none size-4 text-muted-foreground" />
//                                     )}
//                                     {item.getItemName()}
//                                   </span>
//                                 </TreeItemLabel>
//                               </TreeItem>
//                             </ContextMenuTrigger>
//                             <ContextMenuContent>
//                               <ContextMenuItem
//                                 onClick={() => handleOpenDialog('file', item.getId())}
//                               >
//                                 <FilePlus className="mr-2 h-4 w-4" />
//                                 <span>New File</span>
//                               </ContextMenuItem>
//                               <ContextMenuItem
//                                 onClick={() => handleOpenDialog('folder', item.getId())}
//                               >
//                                 <FolderPlus className="mr-2 h-4 w-4" />
//                                 <span>New Folder</span>
//                               </ContextMenuItem>
//                             </ContextMenuContent>
//                           </ContextMenu>
//                         )
//                       }
//                       return (
//                         <TreeItem key={item.getId()} item={item}>
//                           <TreeItemLabel className="before:bg-background relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10">
//                             <span className="flex items-center gap-2">
//                               <FileIcon className="text-muted-foreground pointer-events-none size-4" />
//                               {item.getItemName()}
//                             </span>
//                           </TreeItemLabel>
//                         </TreeItem>
//                       )
//                     })}
//                 </Tree>
//               </div>
//             </div>
//           </div>
//         </ContextMenuTrigger>
//         <ContextMenuContent>
//           <ContextMenuItem onClick={() => handleOpenDialog('file', ROOT_ID)}>
//             <FilePlus className="mr-2 h-4 w-4" />
//             <span>New File</span>
//           </ContextMenuItem>
//           <ContextMenuItem onClick={() => handleOpenDialog('folder', ROOT_ID)}>
//             <FolderPlus className="mr-2 h-4 w-4" />
//             <span>New Folder</span>
//           </ContextMenuItem>
//         </ContextMenuContent>
//       </ContextMenu>
//       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Create {createType}</DialogTitle>
//           </DialogHeader>
//           <Input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder={`Enter ${createType} name`}
//           />
//           <DialogFooter>
//             <Button onClick={handleCreate}>Create</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }

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

interface Item {
  name: string
  children?: string[]
}


export function FileExplorer() {
  const { fileTree, setActiveFileId, addFile, addFolder } = useEditorStore()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [createType, setCreateType] = React.useState<'file' | 'folder' | null>(null)
  const [parentId, setParentId] = React.useState<string | null>(null)
  const [name, setName] = React.useState('')

  console.log(fileTree)

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

  console.log('Items', items)

  const handleOpenDialog = (type: 'file' | 'folder', parentId: string) => {
    setCreateType(type)
    setParentId(parentId)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    if (name && createType && parentId) {
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

  console.log(tree.getItems())

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
      <div className="flex flex-row items-center justify-between border-b border-border p-2 text-muted-foreground">
        <span className="text-sm font-medium">Explorer</span>
        <div className="flex items-center gap-2">
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
          <div className="h-full w-full overflow-y-auto bg-background p-4">
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
                        return (
                          <ContextMenu key={item.getId()}>
                            <ContextMenuTrigger>
                              <TreeItem item={item}>
                                <TreeItemLabel className="relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10 before:bg-background">
                                  <span className="flex items-center gap-2">
                                    {item.isExpanded() ? (
                                      <FolderOpenIcon className="pointer-events-none size-4 text-muted-foreground" />
                                    ) : (
                                      <FolderIcon className="pointer-events-none size-4 text-muted-foreground" />
                                    )}
                                    {item.getItemName()}
                                  </span>
                                </TreeItemLabel>
                              </TreeItem>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
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
                            </ContextMenuContent>
                          </ContextMenu>
                        )
                      }
                      return (
                        <TreeItem key={item.getId()} item={item}>
                          <TreeItemLabel className="before:bg-background relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10">
                            <span className="flex items-center gap-2">
                              <FileIcon className="text-muted-foreground pointer-events-none size-4" />
                              {item.getItemName()}
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
