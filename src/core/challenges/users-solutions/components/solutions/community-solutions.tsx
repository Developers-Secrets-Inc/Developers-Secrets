'use client'

import { UsersSolutionsTagsWithProvider } from '@/core/challenges/users-solutions/components/tags/users-solutions-tags'
import { CommunitySolutionCard } from '@/core/challenges/users-solutions/components/user-solution-card'
import { useTagsAndSorting } from '@/core/challenges/users-solutions/hooks/use-users-solutions-tags'
import { Tag, UserSolution } from '@/payload-types'
import { User } from '@/core/users/types'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { filterAndSortSolutions } from '../../utils/solution-filters'
import { SolutionsSearch } from './solutions-search'

export function CommunitySolutions({
  solutions,
  user,
  challengeSlug,
}: {
  solutions: UserSolution[]
  user: User
  challengeSlug: string
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const { selectedTags, sortBy } = useTagsAndSorting()

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

  const filteredSolutions = useMemo(() => {
    return filterAndSortSolutions(solutions, searchTerm, selectedTags, sortBy)
  }, [solutions, searchTerm, selectedTags, sortBy])

  // Convertir les solutions en format attendu par CommunitySolutionCard

  // Callback pour mettre à jour le terme de recherche
  const handleSearch = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SolutionsSearch onSearch={handleSearch} />
        <UsersSolutionsTagsWithProvider popularTags={popularTags} allTags={allTags} />
      </div>

      <div className="space-y-4">
        {filteredSolutions.length > 0 ? (
          filteredSolutions.map((solution) => (
            <CommunitySolutionCard
              key={solution.id}
              solution={solution}
              user={user}
              url={`/challenges/${challengeSlug}/solutions/${solution.id}`}
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
