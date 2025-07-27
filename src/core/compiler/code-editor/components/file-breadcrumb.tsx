'use client'

import React from 'react'
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator,
  BreadcrumbEllipsis
} from '@/components/ui/breadcrumb'
import { useBreadcrumb } from '../hooks/use-breadcrumb'
import { useEditorStore } from '../store/editor-store'
import { Folder, File, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FileBreadcrumbProps {
  className?: string
  maxItems?: number
  showIcons?: boolean
}

export function FileBreadcrumb({ 
  className, 
  maxItems = 4, 
  showIcons = false 
}: FileBreadcrumbProps) {
  const breadcrumbItems = useBreadcrumb({ maxItems, truncate: true })
  const { setActiveFileId } = useEditorStore()
  
  // Ne pas afficher le breadcrumb si on est à la racine (un seul élément) ou s'il n'y a pas d'éléments
  if (breadcrumbItems.length <= 1) {
    return null
  }
  
  const handleFolderClick = (folderId: string) => {
    // Pour l'instant, on ne fait rien quand on clique sur un dossier
    // Dans le futur, on pourrait naviguer vers le dossier ou l'ouvrir
    console.log('Folder clicked:', folderId)
  }
  
  const shouldShowEllipsis = breadcrumbItems.length > maxItems
  const displayItems = shouldShowEllipsis 
    ? [breadcrumbItems[0], ...breadcrumbItems.slice(-2)]
    : breadcrumbItems
  
  return (
    <div className={cn(
      "bg-[#1a1b26] p-2 pt-1 flex items-center",
      "text-gray-300 text-sm",
      className
    )}>
      <Breadcrumb>
        <BreadcrumbList>
          {shouldShowEllipsis && displayItems.length > 2 && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={() => handleFolderClick(displayItems[0].id)}
                  className="flex items-center gap-1 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                >
                  {showIcons && displayItems[0].type === 'folder' && (
                    <Folder className="h-3.5 w-3.5" />
                  )}
                  {showIcons && displayItems[0].type === 'file' && (
                    <File className="h-3.5 w-3.5" />
                  )}
                  {displayItems[0].name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbEllipsis className="text-gray-500" />
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
              </BreadcrumbSeparator>
            </>
          )}
          
          {displayItems.slice(shouldShowEllipsis ? 1 : 0).map((item, index, array) => {
            const isLast = index === array.length - 1
            const actualIndex = shouldShowEllipsis ? index + 1 : index
            
            return (
              <React.Fragment key={`${item.id}-${actualIndex}`}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="flex items-center gap-1 text-gray-100 text-[13px] font-medium">
                      {showIcons && item.type === 'folder' && (
                        <Folder className="h-3.5 w-3.5" />
                      )}
                      {showIcons && item.type === 'file' && (
                        <File className="h-3.5 w-3.5" />
                      )}
                      {item.name}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink 
                      onClick={() => item.type === 'folder' ? handleFolderClick(item.id) : setActiveFileId(item.id)}
                      className="flex items-center gap-1 text-gray-400 text-[13px] hover:text-gray-200 transition-colors cursor-pointer"
                    >
                      {showIcons && item.type === 'folder' && (
                        <Folder className="h-3.5 w-3.5" />
                      )}
                      {showIcons && item.type === 'file' && (
                        <File className="h-3.5 w-3.5" />
                      )}
                      {item.name}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
                  </BreadcrumbSeparator>
                )}
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}