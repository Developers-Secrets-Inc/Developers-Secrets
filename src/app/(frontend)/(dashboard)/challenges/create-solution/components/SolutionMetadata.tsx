'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import MultipleSelector, { Option } from '@/components/ui/multiselect'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { getTags, createTag } from '@/core/tags'
import { useToast } from '@/components/ui/use-toast'

function useDebounce<T extends (...args: any[]) => any>(callback: T, delay: number) {
  const timeoutRef = useMemo(() => ({ current: null as NodeJS.Timeout | null }), [])

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay, timeoutRef],
  )
}

export interface SolutionMetadata {
  title: string
  description: string
  tags: Option[]
}

interface SolutionMetadataProps {
  onChange?: (metadata: SolutionMetadata) => void
  userId: string
}

const MIN_TAG_LENGTH = 2
const MAX_TAG_LENGTH = 30

export default function SolutionMetadata({ onChange, userId }: SolutionMetadataProps) {
  const { toast } = useToast()
  const [metadata, setMetadata] = useState<SolutionMetadata>({
    title: '',
    description: '',
    tags: [],
  })
  const [availableTags, setAvailableTags] = useState<Option[]>([])
  const [isLoadingTags, setIsLoadingTags] = useState(true)
  const [searchResults, setSearchResults] = useState<Option[]>([])
  const [pendingTags, setPendingTags] = useState<Set<string>>(new Set())

  const loadTags = async () => {
    try {
      const tags = await getTags()
      const tagOptions = tags.map((tag) => ({
        value: tag.id.toString(),
        label: tag.name,
      }))
      setAvailableTags(tagOptions)
      setSearchResults(tagOptions)
    } catch (error) {
      console.error('Error loading tags:', error)
      toast({
        title: 'Error',
        description: 'Failed to load tags',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingTags(false)
    }
  }

  useEffect(() => {
    loadTags()
  }, [])

  const handleChange = (field: keyof SolutionMetadata, value: any) => {
    const newMetadata = { ...metadata, [field]: value }
    setMetadata(newMetadata)
    onChange?.(newMetadata)
  }

  const validateTagName = (tagName: string): string | null => {
    if (!tagName || tagName.trim().length === 0) {
      return 'Tag name cannot be empty'
    }
    if (tagName.trim().length < MIN_TAG_LENGTH) {
      return `Tag name must be at least ${MIN_TAG_LENGTH} characters`
    }
    if (tagName.trim().length > MAX_TAG_LENGTH) {
      return `Tag name cannot exceed ${MAX_TAG_LENGTH} characters`
    }
    if (!/^[a-zA-Z0-9-]+$/.test(tagName)) {
      return 'Tag name can only contain letters, numbers, and hyphens'
    }
    return null
  }

  const handleCreateTag = async (tagName: string) => {
    const error = validateTagName(tagName)
    if (error) {
      toast({
        title: 'Invalid tag',
        description: error,
        variant: 'destructive',
      })
      return null
    }

    const normalizedTag = tagName.trim().toLowerCase()

    // Éviter les doublons pendant la création
    if (pendingTags.has(normalizedTag)) {
      return null
    }

    try {
      setPendingTags((prev) => new Set(prev).add(normalizedTag))
      await createTag(normalizedTag, userId)
      await loadTags()
      toast({
        title: 'Success',
        description: `Tag "${normalizedTag}" created successfully`,
      })
      return normalizedTag
    } catch (error) {
      console.error('Error creating tag:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create tag',
        variant: 'destructive',
      })
      return null
    } finally {
      setPendingTags((prev) => {
        const next = new Set(prev)
        next.delete(normalizedTag)
        return next
      })
    }
  }

  const search = useCallback(
    (searchTerm: string) => {
      const filtered = availableTags.filter((tag) =>
        tag.label.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setSearchResults(filtered)
    },
    [availableTags],
  )

  const debouncedSearch = useDebounce(search, 300)

  return (
    <div className="space-y-4 p-4 bg-[#1f1f1f] border-b">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter solution title..."
          value={metadata.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="bg-[#2d2d2d] border-0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter solution description..."
          value={metadata.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="bg-[#2d2d2d] border-0 min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <MultipleSelector
          value={metadata.tags}
          onChange={(value) => handleChange('tags', value)}
          defaultOptions={availableTags}
          options={searchResults}
          placeholder={isLoadingTags ? 'Loading tags...' : 'Select or create tags...'}
          commandProps={{
            label: 'Select or create tags',
          }}
          creatable
          onSearch={async (value) => {
            if (!value || value.trim().length === 0) {
              setSearchResults(availableTags)
              return availableTags
            }
            debouncedSearch(value)
            return searchResults
          }}
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
          emptyIndicator={
            isLoadingTags ? (
              <p className="text-center text-sm">Loading tags...</p>
            ) : (
              <p className="text-center text-sm">
                {metadata.tags.length >= 5
                  ? 'Maximum tags reached'
                  : 'No matching tags found. Type to create a new tag.'}
              </p>
            )
          }
        />
        <p className="text-xs text-muted-foreground">
          Tags must be {MIN_TAG_LENGTH}-{MAX_TAG_LENGTH} characters long and can only contain
          letters, numbers, and hyphens
        </p>
      </div>
    </div>
  )
}
