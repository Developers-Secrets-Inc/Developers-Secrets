'use client'

import { getUserSolutions } from '@/core/challenges/users-solutions'
import {
  CommunitySolutionCard,
  CommunitySolutionProps,
} from '@/core/challenges/users-solutions/components/user-solution-card'
import { UsersSolutionsSearchBar } from '@/core/challenges/users-solutions/components/users-solutions-search-bar'
import { useTagsAndSorting } from '@/core/challenges/users-solutions/hooks/use-users-solutions-tags'
import { UsersSolutionsTagsWithProvider } from '@/core/challenges/users-solutions/components/tags/users-solutions-tags'
import { getUser } from '@/core/user'
import { Tag, UserSolution } from '@/payload-types'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

type CommunitySolutionsProps = {
  challengeSlug: string
}

export function CommunitySolutions({ challengeSlug }: CommunitySolutionsProps) {
  const [solutions, setSolutions] = useState<UserSolution[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [user, setUser] = useState<Awaited<ReturnType<typeof getUser>> | null>(null)
  const router = useRouter()

  const { selectedTags, sortBy } = useTagsAndSorting()

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

  // Filtrer les solutions en fonction des critères
  const filteredSolutions = useMemo(() => {
    return solutions
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
  }, [solutions, searchTerm, selectedTags, sortBy])

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
      url: `/challenges/${challengeSlug}/solutions/${solution.id}`,
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <UsersSolutionsSearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
        <UsersSolutionsTagsWithProvider popularTags={popularTags} allTags={allTags} />
      </div>

      <div className="space-y-4">
        {filteredSolutions.length > 0 ? (
          filteredSolutions.map((solution) => (
            <CommunitySolutionCard
              key={solution.id}
              solution={adaptSolutionToCardProps(solution)}
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
