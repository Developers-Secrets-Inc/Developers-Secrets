'use client'

import { useState, useEffect, useMemo } from 'react'
import { UserSolution, Tag } from '@/payload-types'
import { getUserSolutions } from '@/core/challenges/users-solutions'
import { getUser } from '@/core/user'
import {
  CommunitySolutionCard,
  CommunitySolutionProps,
} from '@/core/challenges/users-solutions/components/user-solution-card'
import { UsersSolutionsSearchBar } from '@/core/challenges/users-solutions/components/users-solutions-search-bar'
import { UsersSolutionsSorting } from '@/core/challenges/users-solutions/components/users-solutions-sorting'
import { TagsSelectionDialog } from '@/core/challenges/users-solutions/components/tags-selection-dialog'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Filter, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

type CommunitySolutionsProps = {
  challengeSlug: string
}

export function CommunitySolutions({ challengeSlug }: CommunitySolutionsProps) {
  const [solutions, setSolutions] = useState<UserSolution[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isTagsDialogOpen, setIsTagsDialogOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'upvotes' | 'date' | 'comments'>('upvotes')
  const [user, setUser] = useState<Awaited<ReturnType<typeof getUser>> | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedSolutions, currentUser] = await Promise.all([getUserSolutions(), getUser()])
      setSolutions(fetchedSolutions)
      setUser(currentUser)
    }
    fetchData()
  }, [])

  // Calculer les tags et leur popularité
  const { allTags, popularTags } = useMemo(() => {
    const tagCounts = new Map<string, number>()

    solutions.forEach((solution) => {
      solution.tags?.forEach((tag) => {
        if (typeof tag === 'number') return
        const tagName = (tag as Tag).name
        tagCounts.set(tagName, (tagCounts.get(tagName) || 0) + 1)
      })
    })

    const sortedTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)

    return {
      allTags: sortedTags,
      popularTags: sortedTags.slice(0, 2),
    }
  }, [solutions])

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((current) => current.filter((t) => t !== tag))
    } else {
      setSelectedTags((current) => [...current, tag])
    }
  }

  const resetTags = () => {
    setSelectedTags([])
  }

  // Filtrer les solutions en fonction des critères
  const filteredSolutions = solutions
    .filter((solution) => {
      const matchesSearch =
        searchTerm === '' ||
        solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solution.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTags =
        selectedTags.length === 0 ||
        solution.tags?.some((tag) => {
          if (typeof tag === 'number') return false
          return selectedTags.includes((tag as Tag).name)
        })

      return matchesSearch && matchesTags
    })
    .sort((a, b) => {
      if (sortBy === 'upvotes') {
        const aUpvotes = (a.votes || []).filter((vote) => vote.status === 'upvote').length
        const bUpvotes = (b.votes || []).filter((vote) => vote.status === 'upvote').length
        return bUpvotes - aUpvotes
      }
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sortBy === 'comments') {
        return (b.comments?.length || 0) - (a.comments?.length || 0)
      }
      return 0
    })

  // Convertir les solutions en format attendu par CommunitySolutionCard
  const adaptSolutionToCardProps = (solution: UserSolution): CommunitySolutionProps => {
    const firstTag = solution.tags?.[0]
    const language = typeof firstTag === 'number' ? 'Unknown' : (firstTag as Tag)?.name || 'Unknown'

    const isCurrentUserSolution = solution.authorId === user?.id

    return {
      id: solution.id.toString(),
      user: {
        name: isCurrentUserSolution ? user.informations.name : solution.authorId,
        avatar: isCurrentUserSolution ? user.informations.avatar : '',
        initials: isCurrentUserSolution
          ? user.informations.initials
          : solution.authorId.substring(0, 2).toUpperCase(),
      },
      title: solution.title,
      description: solution.description,
      language,
      upvotes: (solution.votes || []).filter((vote) => vote.status === 'upvote').length,
      downvotes: (solution.votes || []).filter((vote) => vote.status === 'downvote').length,
      views: solution.views || 0,
      comments: solution.comments?.length || 0,
      date: new Date(solution.createdAt),
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <UsersSolutionsSearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
        <div className="flex gap-2 items-center">
          {popularTags.length > 0 && (
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
          )}

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setIsTagsDialogOpen(true)}
          >
            <Filter className="h-4 w-4" />
            {selectedTags.length ? `${selectedTags.length} tags selected` : 'More tags'}
          </Button>

          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground"
              onClick={resetTags}
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}

          <UsersSolutionsSorting sortBy={sortBy} onSortByChange={setSortBy} />
        </div>
      </div>

      <TagsSelectionDialog
        open={isTagsDialogOpen}
        onOpenChange={setIsTagsDialogOpen}
        tags={allTags}
        selectedTags={selectedTags}
        onConfirm={setSelectedTags}
      />

      <div className="space-y-4">
        {filteredSolutions.length > 0 ? (
          filteredSolutions.map((solution) => (
            <CommunitySolutionCard
              key={solution.id}
              solution={adaptSolutionToCardProps(solution)}
              onViewSolution={() =>
                router.push(`/challenges/${challengeSlug}/solutions/${solution.id}`)
              }
            />
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No solutions found matching your criteria.
          </div>
        )}
      </div>
    </div>
  )
}
