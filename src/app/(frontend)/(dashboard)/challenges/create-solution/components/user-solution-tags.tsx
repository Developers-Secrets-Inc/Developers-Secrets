'use client'

import { Label } from '@/components/ui/label'
import MultipleSelector, { Option } from '@/components/ui/multiselect'
import { useToast } from '@/components/ui/use-toast'
import { createTag, getTags } from '@/core/tags'
import { Tag } from '@/payload-types'
import { useCallback, useEffect, useMemo, useState } from 'react'

const MIN_TAG_LENGTH = 2
const MAX_TAG_LENGTH = 30

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

export const UserSolutionTags = ({
    initialTags,
    onTagsChange,
    userId,
  }: {
    initialTags: Option[]
    onTagsChange: (tags: Option[]) => void
    userId: string
  }) => {
    const { toast } = useToast()
    const [availableTags, setAvailableTags] = useState<Option[]>([])
    const [isLoadingTags, setIsLoadingTags] = useState(true)
    const [searchResults, setSearchResults] = useState<Option[]>([])
    const [isCreatingTag, setIsCreatingTag] = useState(false)
    const [allTags, setAllTags] = useState<Tag[]>([])
  
    const loadTags = async () => {
      try {
        const tags = await getTags()
        setAllTags(tags)
        const tagOptions = tags.map((tag) => ({
          value: tag.id.toString(),
          label: tag.name,
        }))
        setAvailableTags(tagOptions)
        setSearchResults(tagOptions)
  
        // Si nous avons des tags initiaux, trouvons leurs noms
        if (initialTags && initialTags.length > 0) {
          const initialTagOptions = initialTags.map((tag) => {
            const matchingTag = tags.find((t) => t.id.toString() === tag.value)
            return {
              value: tag.value,
              label: matchingTag ? matchingTag.name : tag.value,
            }
          })
          onTagsChange(initialTagOptions)
        }
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
  
    const handleChange = (
      field: keyof SolutionMetadata,
      value: SolutionMetadata[keyof SolutionMetadata],
    ) => {
      const newMetadata = { ...initialTags, [field]: value }
      onTagsChange(newMetadata)
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
  
    const handleSearch = async (value: string): Promise<Option[]> => {
      if (!value || value.trim().length === 0) {
        setSearchResults(availableTags)
        return availableTags
      }
  
      const error = validateTagName(value)
      if (!error) {
        // Si la valeur est valide, on l'ajoute comme option possible
        const normalizedValue = value.trim().toLowerCase()
        const existingTag = availableTags.find((tag) => tag.label.toLowerCase() === normalizedValue)
  
        if (!existingTag && !isCreatingTag) {
          const newResults = [
            ...availableTags.filter((tag) => tag.label.toLowerCase().includes(normalizedValue)),
            { value: normalizedValue, label: normalizedValue },
          ]
          setSearchResults(newResults)
          return newResults
        }
      }
  
      debouncedSearch(value)
      return searchResults
    }
  
    const handleSelect = async (options: Option[]) => {
      const lastOption = options[options.length - 1]
  
      // Si c'est un nouveau tag (pas d'ID numérique)
      if (lastOption && !lastOption.value.match(/^\d+$/)) {
        setIsCreatingTag(true)
        try {
          await createTag(lastOption.label, userId)
          await loadTags()
  
          // Attendre que les tags soient rechargés
          const allTags = await getTags()
          const newTag = allTags.find(
            (tag) => tag.name.toLowerCase() === lastOption.label.toLowerCase(),
          )
  
          if (newTag) {
            // Remplacer le tag temporaire par le vrai tag
            const updatedOptions = options.map((opt) =>
              opt.value === lastOption.value
                ? { value: newTag.id.toString(), label: newTag.name }
                : opt,
            )
            handleChange('tags', updatedOptions)
            return
          }
        } catch (error) {
          console.error('Error creating tag:', error)
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Failed to create tag',
            variant: 'destructive',
          })
          // Retirer le tag qui n'a pas pu être créé
          handleChange('tags', options.slice(0, -1))
          return
        } finally {
          setIsCreatingTag(false)
        }
      }
  
      handleChange('tags', options)
    }
  
    return (
      <div className="space-y-2">
        <Label>Tags</Label>
        <MultipleSelector
          value={initialTags}
          onChange={onTagsChange}
          defaultOptions={availableTags}
          options={searchResults}
          placeholder={isLoadingTags ? 'Loading tags...' : 'Select or create tags...'}
          commandProps={{
            label: 'Select or create tags',
          }}
          creatable
          onSearch={handleSearch}
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
                {initialTags.length >= 5
                  ? 'Maximum tags reached'
                  : 'No matching tags found. Type to create a new tag.'}
              </p>
            )
          }
        />
        <p className="text-xs text-muted-foreground">
          Tags must be {MIN_TAG_LENGTH}-{MAX_TAG_LENGTH} characters long and can only contain letters,
          numbers, and hyphens
        </p>
      </div>
    )
  }