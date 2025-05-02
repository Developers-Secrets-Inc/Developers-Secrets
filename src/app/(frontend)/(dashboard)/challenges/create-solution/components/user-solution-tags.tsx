'use client'

import { Label } from '@/components/ui/label'
import MultipleSelector, { Option } from '@/components/ui/multiselect'
import { useToast } from '@/components/ui/use-toast'
import { useSolutionFormStore } from '../store/solution-form-store'
import { useSolutionTags } from '../hooks/use-solution-tags'

const MIN_TAG_LENGTH = 2
const MAX_TAG_LENGTH = 30
const MAX_TAG_SELECTION = 5

export const UserSolutionTags = () => {
  const { toast } = useToast()

  const { availableTagOptions, updateSelectedTags, isLoadingTags } = useSolutionTags()

  const selectedTagOptionsFromStore = useSolutionFormStore((state) => state.tags)

  return (
    <div className="space-y-2">
      <Label>Tags</Label>
      <MultipleSelector
        value={selectedTagOptionsFromStore}
        onChange={updateSelectedTags}
        defaultOptions={availableTagOptions}
        placeholder={isLoadingTags ? 'Loading tags...' : 'Select or create tags...'}
        commandProps={{
          label: 'Select or create tags',
        }}
        creatable
        onMaxSelected={(max) => {
          toast({
            title: 'Maximum tags reached',
            description: `You can only select up to ${max} tags`,
            variant: 'destructive',
          })
        }}
        maxSelected={MAX_TAG_SELECTION}
        hideClearAllButton={false}
        hidePlaceholderWhenSelected
        loadingIndicator={
          isLoadingTags ? <p className="text-center text-sm py-6">Loading tags...</p> : undefined
        }
        emptyIndicator={
          <p className="text-center text-sm p-4">
            {selectedTagOptionsFromStore.length >= MAX_TAG_SELECTION
              ? 'Maximum tags reached'
              : 'No matching tags found. Type to create a new tag.'}
          </p>
        }
      />
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">
          Tags must be {MIN_TAG_LENGTH}-{MAX_TAG_LENGTH} characters long and can only contain
          letters, numbers, and hyphens
        </p>
      </div>
    </div>
  )
}
