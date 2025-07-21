'use client'

import { useState } from 'react'

export const useTagsAndSorting = () => {
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [isTagsDialogOpen, setIsTagsDialogOpen] = useState(false)
    const [sortBy, setSortBy] = useState<'upvotes' | 'date' | 'comments'>('upvotes')
  
    const resetTags = () => setSelectedTags([])
  
    return {
      selectedTags,
      setSelectedTags,
      isTagsDialogOpen,
      setIsTagsDialogOpen,
      sortBy,
      setSortBy,
      resetTags,
    }
  }