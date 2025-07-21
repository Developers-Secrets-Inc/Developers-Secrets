'use client'

import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { UsersSolutionsSorting } from '@/core/challenges/users-solutions/components/users-solutions-sorting'
import { TagsSelectionDialog } from '@/core/challenges/users-solutions/components/tags-selection-dialog'
import { Filter, X } from 'lucide-react'
import { useTags } from './users-solutions-tags-provider'
import { TagsProvider } from './users-solutions-tags-provider'

const PopularTags = ({ popularTags }: { popularTags: string[] }) => {
  const { selectedTags, setSelectedTags } = useTags()

  return (
    popularTags.length > 0 && (
      <ToggleGroup
        type="multiple"
        variant="outline"
        className="inline-flex"
        value={selectedTags}
        onValueChange={setSelectedTags}
      >
        {popularTags.map((tag) => (
          <ToggleGroupItem key={tag} value={tag} className="text-xs capitalize">
            {tag}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    )
  )
}

const TagsFilterButton = () => {
  const { selectedTags, setIsTagsDialogOpen } = useTags()

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      onClick={() => setIsTagsDialogOpen(true)}
    >
      <Filter className="h-4 w-4" />
      {selectedTags.length ? `${selectedTags.length} tags selected` : 'More tags'}
    </Button>
  )
}

const ClearTagsButton = () => {
  const { resetTags } = useTags()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 text-muted-foreground"
      onClick={resetTags}
    >
      <X className="h-4 w-4" />
      Clear
    </Button>
  )
}

const SortingControl = () => {
  const { sortBy, setSortBy } = useTags()
  return <UsersSolutionsSorting sortBy={sortBy} onSortByChange={setSortBy} />
}

type UsersSolutionsTagsProps = {
  popularTags: string[]
  allTags: string[]
}

export const UsersSolutionsTags = ({ popularTags, allTags }: UsersSolutionsTagsProps) => {
  const { selectedTags, setSelectedTags, isTagsDialogOpen, setIsTagsDialogOpen } = useTags()

  return (
    <>
      <div className="flex gap-2 items-center">
        <PopularTags popularTags={popularTags} />
        <TagsFilterButton />
        {selectedTags.length > 0 && <ClearTagsButton />}
        <SortingControl />
      </div>

      <TagsSelectionDialog
        open={isTagsDialogOpen}
        onOpenChange={setIsTagsDialogOpen}
        tags={allTags}
        selectedTags={selectedTags}
        onConfirm={setSelectedTags}
      />
    </>
  )
}

export const UsersSolutionsTagsWithProvider = ({
  popularTags,
  allTags,
}: UsersSolutionsTagsProps) => {
  return (
    <TagsProvider>
      <UsersSolutionsTags popularTags={popularTags} allTags={allTags} />
    </TagsProvider>
  )
}
