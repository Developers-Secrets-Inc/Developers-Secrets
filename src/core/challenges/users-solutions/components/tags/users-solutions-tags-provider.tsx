'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type TagsContextType = {
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
  isTagsDialogOpen: boolean
  setIsTagsDialogOpen: (isOpen: boolean) => void
  sortBy: 'upvotes' | 'date' | 'comments'
  setSortBy: (sort: 'upvotes' | 'date' | 'comments') => void
  resetTags: () => void
}

const TagsContext = createContext<TagsContextType | undefined>(undefined)

export const TagsProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isTagsDialogOpen, setIsTagsDialogOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'upvotes' | 'date' | 'comments'>('upvotes')

  const resetTags = () => setSelectedTags([])

  return (
    <TagsContext.Provider
      value={{
        selectedTags,
        setSelectedTags,
        isTagsDialogOpen,
        setIsTagsDialogOpen,
        sortBy,
        setSortBy,
        resetTags,
      }}
    >
      {children}
    </TagsContext.Provider>
  )
}

export const useTags = () => {
  const context = useContext(TagsContext)
  if (!context) {
    throw new Error('useTags must be used within a TagsProvider')
  }
  return context
}
