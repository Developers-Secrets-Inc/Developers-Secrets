'use client'

import { useState, useMemo, useCallback, useTransition, useEffect } from 'react'
import { CommunitySolutionCard, CommunitySolutionProps } from './community-solution-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { SolutionDetailProps } from './solution-detail'
import { EXAMPLE_SOLUTIONS } from '../data/solutions-data'
import { subscribeToSolutions } from '@/lib/real-time-utils'
import { useToast } from '@/components/ui/use-toast'

type CommunitySolutionsProps = {
  challengeSlug: string
}

export function CommunitySolutions({ challengeSlug }: CommunitySolutionsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'upvotes' | 'date' | 'comments'>('upvotes')
  const [solutions, setSolutions] = useState<SolutionDetailProps[]>(EXAMPLE_SOLUTIONS)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  // Subscribe to real-time updates for solutions
  useEffect(() => {
    // Start with static data from ISR
    setSolutions(EXAMPLE_SOLUTIONS)

    // Subscribe to real-time updates
    const unsubscribe = subscribeToSolutions(challengeSlug, (newSolution) => {
      setSolutions((currentSolutions) => {
        // Check if the solution already exists
        const existingIndex = currentSolutions.findIndex((s) => s.id === newSolution.id)

        if (existingIndex >= 0) {
          // Update existing solution
          const updatedSolutions = [...currentSolutions]
          updatedSolutions[existingIndex] = newSolution
          return updatedSolutions
        } else {
          // Add new solution
          toast({
            title: 'New solution added',
            description: `${newSolution.user?.name || 'A user'} added a new solution: ${newSolution.title}`,
          })
          return [newSolution, ...currentSolutions]
        }
      })
    })

    // Cleanup subscription when component unmounts
    return () => {
      unsubscribe()
    }
  }, [challengeSlug, toast])

  // Extraction des langages - mémorisée pour éviter des recalculs inutiles
  const languages = useMemo(() => {
    return [...new Set(solutions.map((solution) => solution.language))]
  }, [solutions])

  // Optimisation: filtrage mémorisé pour éviter des recalculs à chaque rendu
  const filteredSolutions = useMemo(() => {
    return solutions
      .filter(
        (solution) =>
          (searchTerm === '' ||
            solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            solution.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            solution.user.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (selectedLanguage === null || solution.language === selectedLanguage),
      )
      .sort((a, b) => {
        if (sortBy === 'upvotes') return b.upvotes - a.upvotes
        if (sortBy === 'date') return b.date.getTime() - a.date.getTime()
        if (sortBy === 'comments') return b.comments - a.comments
        return 0
      })
  }, [searchTerm, selectedLanguage, sortBy, solutions])

  // Optimisation: fonction de navigation avec transition fluide
  const handleViewSolution = useCallback(
    (id: string) => {
      startTransition(() => {
        router.prefetch(`/challenges/${challengeSlug}/solutions/${id}`)
        router.push(`/challenges/${challengeSlug}/solutions/${id}`)
      })
    },
    [challengeSlug, router],
  )

  // Optimisation: setters mémorisés pour éviter la recréation de fonctions
  const handleSetSelectedLanguage = useCallback((language: string | null) => {
    setSelectedLanguage(language)
  }, [])

  const handleSetSortBy = useCallback((sort: 'upvotes' | 'date' | 'comments') => {
    setSortBy(sort)
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">Community Solutions</h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search solutions..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="inline-flex">
            <Button
              variant={selectedLanguage === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSetSelectedLanguage(null)}
              className="rounded-r-none"
            >
              All
            </Button>
            {languages.map((lang) => (
              <Button
                key={lang}
                variant={selectedLanguage === lang ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSetSelectedLanguage(lang)}
                className={
                  lang === languages[languages.length - 1]
                    ? 'rounded-l-none'
                    : 'rounded-none border-l-0'
                }
              >
                {lang}
              </Button>
            ))}
          </div>
          <div className="inline-flex">
            <Button
              variant={sortBy === 'upvotes' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSetSortBy('upvotes')}
              className="rounded-r-none"
            >
              Top
            </Button>
            <Button
              variant={sortBy === 'date' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSetSortBy('date')}
              className="rounded-none border-l-0"
            >
              Recent
            </Button>
            <Button
              variant={sortBy === 'comments' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSetSortBy('comments')}
              className="rounded-l-none border-l-0"
            >
              Most Discussed
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredSolutions.length > 0 ? (
          filteredSolutions.map((solution) => (
            <CommunitySolutionCard
              key={solution.id}
              solution={solution}
              onViewSolution={() => handleViewSolution(solution.id)}
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

// Exporter les solutions pour pouvoir les utiliser dans la page détaillée
export { EXAMPLE_SOLUTIONS }
