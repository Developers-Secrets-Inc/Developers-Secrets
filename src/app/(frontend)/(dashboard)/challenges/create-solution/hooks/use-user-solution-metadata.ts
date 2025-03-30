'use client'

import { useEffect, useState } from 'react'
import { Option } from '@/components/ui/multiselect'

export interface SolutionMetadata {
  title: string
  description: string
  tags: Option[]
}

const useUserSolutionMetadata = (initialData?: SolutionMetadata) => {
  const [metadata, setMetadata] = useState<SolutionMetadata>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    tags: initialData?.tags || [],
  })

  useEffect(() => {
    if (initialData) {
      setMetadata({
        title: initialData.title || metadata.title,
        description: initialData.description || metadata.description,
        tags: initialData.tags || metadata.tags,
      })
    }
  }, [initialData])

  const updateField = (field: keyof SolutionMetadata, value: any) => {
    setMetadata((prev) => ({ ...prev, [field]: value }))
  }

  return {
    metadata,
    updateField,
  }
}

export default useUserSolutionMetadata
