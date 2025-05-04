'use client'

import { useEffect, useState } from 'react'
// Remove Option import if no longer needed here
// import { Option } from '@/components/ui/multiselect'

// Remove 'tags' from this interface
export interface SolutionMetadataFields {
  title: string
  description: string
}

const useUserSolutionMetadata = (initialData?: SolutionMetadataFields) => {
  // Remove 'tags' from state
  const [metadata, setMetadata] = useState<SolutionMetadataFields>({
    title: initialData?.title || '',
    description: initialData?.description || '',
  })

  useEffect(() => {
    if (initialData) {
      // Update only title and description
      setMetadata({
        title: initialData.title || metadata.title,
        description: initialData.description || metadata.description,
      })
    }
    // metadata dependency removed to avoid loop if initialData changes less often
  }, [initialData]) // eslint-disable-line react-hooks/exhaustive-deps

  // Update field signature
  const updateField = (field: keyof SolutionMetadataFields, value: string) => {
    setMetadata((prev) => ({ ...prev, [field]: value }))
  }

  return {
    metadata,
    updateField,
    setMetadata, // Keep setMetadata if SolutionMetadata component needs to update the whole object
  }
}

export default useUserSolutionMetadata
