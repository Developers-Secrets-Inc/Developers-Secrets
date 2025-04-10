'use client'

import { Label } from '@/components/ui/label'
import MultipleSelector, { Option } from '@/components/ui/multiselect'
import { useToast } from '@/components/ui/use-toast'
import { createTag, getAvailableTagsForUser, getTags, getUserNonPublicTags } from '@/core/tags'
import { Tag } from '@/payload-types'
import { useCallback, useEffect, useMemo, useState } from 'react'

const MIN_TAG_LENGTH = 2
const MAX_TAG_LENGTH = 30

function useDebounce<T extends (...args: any[]) => Promise<any>>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  const timeoutRef = useMemo(() => ({ current: null as NodeJS.Timeout | null }), [])

  return useCallback(
    (...args: Parameters<T>) => {
      return new Promise((resolve, reject) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(async () => {
          try {
            const result = await callback(...args)
            resolve(result)
          } catch (error) {
            reject(error)
          }
        }, delay)
      })
    },
    [callback, delay, timeoutRef],
  )
}

export interface SolutionMetadata {
  title: string
  description: string
  tags: Option[]
}

const convertTagToOption = (tag: Tag): Option => ({
  value: tag.id.toString(),
  label: tag.status === 'test' ? `${tag.name} (private)` : tag.name,
})

type UserSolutionTagsProps = {
  selectedTags: Option[]
  searchTags: Option[]
  onTagsChange: (tags: Option[]) => void
}

export const UserSolutionTags = ({
  selectedTags,
  searchTags,
  onTagsChange,
}: UserSolutionTagsProps) => {
  const { toast } = useToast()
  const [availableTags, setAvailableTags] = useState<Option[]>([...searchTags, ...selectedTags])
  const [isLoadingTags, setIsLoadingTags] = useState(true)
  const [searchResults, setSearchResults] = useState<Option[]>([...searchTags, ...selectedTags])
  const [isCreatingTag, setIsCreatingTag] = useState(false)

  const handleSearch = useCallback(
    async (searchValue: string): Promise<Option[]> => {
      if (!searchValue.trim()) {
        setSearchResults(availableTags)
        return availableTags
      }

      const searchLower = searchValue.toLowerCase()
      const filteredTags = availableTags.filter((tag) =>
        tag.label.toLowerCase().includes(searchLower),
      )

      // Always show user's non-public tags first in search results if they match
      const matchingUserTags = selectedTags.filter((tag) =>
        tag.label.toLowerCase().includes(searchLower),
      )
      const matchingPublicTags = filteredTags.filter(
        (tag) => !selectedTags.some((userTag) => userTag.value === tag.value),
      )

      const results = [...matchingUserTags, ...matchingPublicTags]
      setSearchResults(results)
      return results
    },
    [availableTags],
  )

  const debouncedSearch = useDebounce(handleSearch, 300)

  return (
    <div className="space-y-2">
      <Label>Tags</Label>
      <MultipleSelector
        value={selectedTags}
        onChange={onTagsChange}
        defaultOptions={availableTags}
        options={searchResults}
        placeholder={isLoadingTags ? 'Loading tags...' : 'Select or create tags...'}
        commandProps={{
          label: 'Select or create tags',
        }}
        creatable
        onSearch={debouncedSearch}
        onMaxSelected={(max) => {
          toast({
            title: 'Maximum tags reached',
            description: `You can only select up to ${max} tags`,
            variant: 'destructive',
          })
        }}
        maxSelected={5}
        hideClearAllButton={false}
        hidePlaceholderWhenSelected
        loadingIndicator={
          isCreatingTag ? <p className="text-center text-sm py-6">Creating tag...</p> : undefined
        }
        emptyIndicator={
          isLoadingTags ? (
            <p className="text-center text-sm">Loading tags...</p>
          ) : (
            <p className="text-center text-sm">
              {selectedTags.length >= 5
                ? 'Maximum tags reached'
                : 'No matching tags found. Type to create a new tag.'}
            </p>
          )
        }
      />
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">
          Tags must be {MIN_TAG_LENGTH}-{MAX_TAG_LENGTH} characters long and can only contain
          letters, numbers, and hyphens
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Note:</span> Tags marked with (private) are your personal
          tags that are not yet public. They will become public once they have been used in at least
          10 solutions and are at least 7 days old.
        </p>
      </div>
    </div>
  )
}
