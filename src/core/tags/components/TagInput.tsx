import * as React from 'react'
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react'
import { Tag } from '@/payload-types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { createTag, getTagByName } from '..'
import { TagNotFoundError } from '../errors'

interface TagInputProps {
  value?: Tag[]
  onValueChange?: (tags: Tag[]) => void
  creatorId: string
  placeholder?: string
  disabled?: boolean
}

export const TagInput = ({
  value = [],
  onValueChange,
  creatorId,
  placeholder = 'Select tags...',
  disabled = false,
}: TagInputProps) => {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isCreating, setIsCreating] = React.useState(false)
  const [suggestions, setSuggestions] = React.useState<Tag[]>([])

  const fetchSuggestions = React.useCallback(
    async (query: string) => {
      if (!query) return

      try {
        const tag = await getTagByName(query)
        if (!suggestions.some((s) => s.id === tag.id)) {
          setSuggestions((prev) => [...prev, tag])
        }
      } catch (error) {
        if (!(error instanceof TagNotFoundError)) {
          console.error('Error fetching tag suggestions:', error)
        }
      }
    },
    [suggestions],
  )

  const handleCreateTag = async () => {
    if (!searchQuery) return

    setIsCreating(true)
    try {
      await createTag(searchQuery, creatorId)
      const newTag = await getTagByName(searchQuery)
      setSuggestions((prev) => [...prev, newTag])
      onValueChange?.([...value, newTag])
      setSearchQuery('')
    } catch (error) {
      console.error('Error creating tag:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleSelect = async (selectedTag: Tag) => {
    const isSelected = value.some((tag) => tag.id === selectedTag.id)

    if (isSelected) {
      onValueChange?.(value.filter((tag) => tag.id !== selectedTag.id))
    } else {
      onValueChange?.([...value, selectedTag])
    }
  }

  React.useEffect(() => {
    if (searchQuery) {
      fetchSuggestions(searchQuery)
    }
  }, [searchQuery, fetchSuggestions])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value.length > 0
            ? `${value.length} tag${value.length === 1 ? '' : 's'} selected`
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search tags..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleCreateTag}
                  disabled={isCreating}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create &quot;{searchQuery}&quot;
                </Button>
              )}
            </CommandEmpty>
            {suggestions.length > 0 && (
              <CommandGroup heading="Suggestions">
                {suggestions.map((tag) => (
                  <CommandItem key={tag.id} value={tag.name} onSelect={() => handleSelect(tag)}>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value.some((v) => v.id === tag.id) ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {tag.name}
                    {tag.status === 'test' && (
                      <span className="ml-2 text-xs text-muted-foreground">(test)</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
          {suggestions.length > 0 && <CommandSeparator />}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
