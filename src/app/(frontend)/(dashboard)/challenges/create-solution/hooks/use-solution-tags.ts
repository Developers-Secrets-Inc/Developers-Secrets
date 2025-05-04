'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo, useCallback } from 'react'
import { Option } from '@/components/ui/multiselect' // Import Option type
import { Tag as PayloadTag } from '@/payload-types' // Import Payload Tag type
import { useSolutionFormStore } from '../store/solution-form-store' // Import Zustand store
import { getTags } from '@/core/tags' // Assume this fetches all PayloadTags

// Define the shape of the object returned by the hook
interface UseSolutionTagsResult {
  availableTagOptions: Option[] // Options for the dropdown (all existing tags)
  updateSelectedTags: (newSelection: Option[]) => void // Function to update Zustand store
  isLoadingTags: boolean // Loading state for fetching all tags
}

/**
 * Custom hook to manage tag selection logic for the solution form.
 * - Fetches all available tags to be used as options.
 * - Provides a function to update the selected tags in the Zustand store.
 * - The store itself is expected to hold the selected tags as Option[].
 */
export const useSolutionTags = (): UseSolutionTagsResult => {
  // 1. Fetch all existing tags using React Query
  const { data: allPayloadTags, isLoading: isLoadingTags } = useQuery<PayloadTag[]>({
    // Use object syntax
    queryKey: ['tags', 'all'],
    queryFn: async () => await getTags(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // 2. Get the setter function from Zustand store
  const setTagsInStore = useSolutionFormStore((state) => state.setTags)

  // 3. Memoized conversion for available tags -> Options
  const availableTagOptions: Option[] = useMemo(() => {
    // Ensure allPayloadTags is an array before mapping
    if (!Array.isArray(allPayloadTags)) return []
    return allPayloadTags.map((tag: PayloadTag) => ({
      value: tag.id.toString(),
      label: tag.status === 'test' ? `${tag.name} (private)` : tag.name,
    }))
  }, [allPayloadTags])

  // 4. Selected tags are read directly from the store by the component
  //    No need for selectedTagOptions conversion here as the store holds Option[]

  // 5. Callback to update Zustand store directly with Multiselect's Option[]
  const updateSelectedTags = useCallback(
    (newSelection: Option[]) => {
      // Pass the Option[] directly to the store setter
      setTagsInStore(newSelection)
    },
    [setTagsInStore],
  )

  // 6. Return values needed by the component
  return { availableTagOptions, updateSelectedTags, isLoadingTags }
}
