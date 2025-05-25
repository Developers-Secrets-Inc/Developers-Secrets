'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { getRandomUncompletedChallenge } from '@/core/skills/recommendations'
import { getUser } from '@/core/user'
import type { Challenge, Concept, User } from '@/payload-types'
import { Brain, RefreshCw, SearchX, Shuffle, TrendingDown, TrendingUp, Trophy } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// Import ToggleGroup and Tooltip components
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import * as Tooltip from '@radix-ui/react-tooltip'
import { Skeleton } from '@/components/ui/skeleton'

// Define a type for the recommended challenge that includes bonusExperience for dummy data
type RecommendedChallengeType = Challenge & { bonusExperience?: number }

export const RecommendedChallenge = () => {
  const [user, setUser] = useState<User | null>(null)
  const [recommendedChallenge, setRecommendedChallenge] = useState<Challenge | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Value for ToggleGroup, though we might not strictly need to manage its state
  // if each button just triggers an action and doesn't stay "pressed"
  const [feedback, setFeedback] = useState<string | undefined>(undefined)

  // Function to fetch a new random challenge
  const fetchNewRandomChallenge = async (feedbackType?: string) => {
    if (!user || !user.id) {
      // console.warn('fetchNewRandomChallenge: User not available yet.');
      // If user is not loaded yet, we might not want to fetch, or queue it.
      // For now, let's wait for user to be loaded by useEffect.
      return
    }
    setIsLoading(true)
    setError(null)
    // In the future, feedbackType can be used to influence the next recommendation
    console.log('Fetching new challenge with feedback:', feedbackType)
    try {
      // Ensure user.id is a string as expected by some ID fields
      const challenge = await getRandomUncompletedChallenge(String(user.id))
      setRecommendedChallenge(challenge)
    } catch (e) {
      console.error('Error fetching recommended challenge:', e)
      setError('Failed to load a new challenge. Please try again.')
      setRecommendedChallenge(null) // Clear previous challenge on error
    } finally {
      setIsLoading(false)
      setFeedback(undefined) // Reset toggle group visual state after action
    }
  }

  // Fetch user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getUser()
        // The User type from @/payload-types might be for Payload CMS user document.
        // getUser() might return a more comprehensive object (Supabase + Payload).
        // For now, let's assert it to the User type we have, or use a more general type if needed.
        setUser(fetchedUser as User | null)
      } catch (err) {
        console.error('Failed to fetch user:', err)
        setError('Could not load user data.')
        setIsLoading(false) // Stop loading if user fetch fails
      }
    }
    fetchUser()
  }, [])

  // Fetch initial challenge once user is loaded
  useEffect(() => {
    if (user && user.id) {
      fetchNewRandomChallenge()
    }
    // Intentionally not refetching if user changes for now,
    // as user is fetched once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]) // Dependency array includes user

  const getDifficultyColor = (difficulty: string | null | undefined) => {
    switch (difficulty?.toLowerCase()) {
      case 'very_easy':
        return 'bg-cyan-500/10 text-cyan-500'
      case 'easy':
        return 'bg-emerald-500/10 text-emerald-500'
      case 'medium':
        return 'bg-amber-500/10 text-amber-500'
      case 'hard':
        return 'bg-red-500/10 text-red-500'
      case 'horrible':
        return 'bg-purple-500/10 text-purple-500'
      default:
        return 'bg-slate-500/10 text-slate-500'
    }
  }

  if (isLoading && !recommendedChallenge) {
    // Show full page loading only on initial load or if challenge is null
    return (
      <Card className="w-full py-0 border-dashed border-border">
        <div className="flex flex-col items-center justify-center p-6 text-center">
          {/* Basic loading spinner or text */}
          <RefreshCw className="h-12 w-12 text-muted-foreground mb-4 animate-spin" />
          <CardTitle className="text-xl mb-1">Loading Recommendation...</CardTitle>
          <CardDescription className="mb-4">
            We're finding a great challenge for you!
          </CardDescription>
        </div>
      </Card>
    )
  }

  if (error && !recommendedChallenge) {
    // Show error only if there's no challenge to display
    return (
      <Card className="w-full py-0 border-dashed border-border">
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <SearchX className="h-12 w-12 text-destructive mb-4" />
          <CardTitle className="text-xl mb-1 text-destructive">
            Oops! Something went wrong.
          </CardTitle>
          <CardDescription className="mb-4">{error}</CardDescription>
          <Button onClick={() => fetchNewRandomChallenge('retry')} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  if (!recommendedChallenge) {
    // This state can be reached if initial load finishes and no challenge is found (and no error thrown by fetch)
    return (
      <Card className="w-full py-0 border-dashed border-border">
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-xl mb-1">No challenges available right now</CardTitle>
          <CardDescription className="mb-4">
            Please check back later or try refreshing!
          </CardDescription>
          <Button onClick={() => fetchNewRandomChallenge('suggest_initial')} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Suggest a Challenge
          </Button>
        </div>
      </Card>
    )
  }

  // Display the recommended challenge
  return (
    <Card className="w-full py-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-4">
        {/* Left side */}
        <div className="flex-1 mr-6">
          {/* Simplified recommendation text for now */}
          <div className="mb-2 text-sm font-medium text-primary">Here's a challenge for you:</div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <CardTitle className="text-xl">{recommendedChallenge.title}</CardTitle>
            <Badge
              className={getDifficultyColor(recommendedChallenge.difficulty)}
              variant="secondary"
            >
              {recommendedChallenge.difficulty
                ? recommendedChallenge.difficulty
                    .replace('_', ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())
                : 'N/A'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <CardDescription className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>{recommendedChallenge.baseExperience || '?'} XP</span>
            </CardDescription>
            {/* Concepts Display (kept from original) */}
            <div className="flex flex-wrap gap-2">
              {recommendedChallenge.concepts?.map(
                (conceptRelation: {
                  id?: string | number | null
                  concept: string | number | Concept | null
                }) => {
                  const concept =
                    typeof conceptRelation.concept === 'object' ? conceptRelation.concept : null
                  const conceptName = concept ? concept.name : 'Concept'
                  const conceptId =
                    typeof conceptRelation.concept === 'number'
                      ? conceptRelation.concept
                      : typeof conceptRelation.concept === 'object' && conceptRelation.concept?.id
                        ? conceptRelation.concept.id
                        : conceptRelation.id

                  return conceptId ? (
                    <Badge
                      key={String(conceptId)}
                      variant="outline"
                      className="flex items-center gap-1 whitespace-nowrap"
                    >
                      <Brain className="h-3 w-3" />
                      {conceptName}
                    </Badge>
                  ) : null
                },
              )}
            </div>
          </div>
        </div>
        {/* Right side */}
        <div className="flex flex-col items-end gap-3 flex-shrink-0 mt-4 md:mt-0">
          <Button asChild className="w-full md:w-auto">
            <Link href={`/challenges/${recommendedChallenge.slug}`}>Start Challenge</Link>
          </Button>

          <Tooltip.Provider delayDuration={100}>
            <ToggleGroup
              type="single"
              variant="outline"
              className="inline-flex w-full md:w-auto justify-end"
              value={feedback}
              onValueChange={(value) => {
                // If a value is selected (clicked again to deselect, or another selected)
                // For now, we trigger the action immediately.
                // The value change itself might not be needed if it always triggers action.
                if (value) {
                  // fetchNewRandomChallenge(value); // 'value' will be 'too_easy', 'too_hard', 'new_recommendation'
                  // setFeedback(value); // Keep it visually pressed until loading finishes
                } else {
                  // setFeedback(undefined); // If it's deselected by clicking again
                }
              }}
            >
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <ToggleGroupItem
                    value="too_easy"
                    aria-label="Too easy"
                    onClick={() => fetchNewRandomChallenge('too_easy')}
                    disabled={isLoading}
                    className="flex-1 md:flex-none"
                  >
                    <TrendingUp className="h-4 w-4" />
                  </ToggleGroupItem>
                </Tooltip.Trigger>
                <TooltipContentCustom>Too Easy</TooltipContentCustom>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <ToggleGroupItem
                    value="too_hard"
                    aria-label="Too hard"
                    onClick={() => fetchNewRandomChallenge('too_hard')}
                    disabled={isLoading}
                    className="flex-1 md:flex-none"
                  >
                    <TrendingDown className="h-4 w-4" />
                  </ToggleGroupItem>
                </Tooltip.Trigger>
                <TooltipContentCustom>Too Hard</TooltipContentCustom>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <ToggleGroupItem
                    value="new_recommendation"
                    aria-label="New recommendation"
                    onClick={() => fetchNewRandomChallenge('new_recommendation')}
                    disabled={isLoading}
                    className="flex-1 md:flex-none"
                  >
                    <Shuffle className="h-4 w-4" /> {/* Using Shuffle for variety */}
                  </ToggleGroupItem>
                </Tooltip.Trigger>
                <TooltipContentCustom>New Recommendation</TooltipContentCustom>
              </Tooltip.Root>
            </ToggleGroup>
          </Tooltip.Provider>
        </div>
      </div>
    </Card>
  )
}


export const RecommendedChallengeSkeleton = () => {
  return (
    <Card className="w-full py-0 border-dashed border-border">
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <Skeleton className="h-12 w-12 text-muted-foreground mb-4 animate-spin" />
        <Skeleton className="h-12 w-12 text-muted-foreground mb-4 animate-spin" />
      </div>
    </Card>
  )
}


/*  

Remaining comments from original file - can be addressed in future iterations:

On recommande un challenge en fonction du niveau de l'utilisateur et de ses compétences actuelles. Ce composant doit donc uniquement faire un appel à une fonction `getRecommendedChallenge`.
- L'utilisateur doit comprendre quelles sont les compétences qui sont travaillées par ce challenge.
- On doit lui donner la possibilité de générer un nouveau challenge si celui-ci ne lui convient pas. (DONE - basic version)
  - Pas intéressé, trop facile, trop difficile, etc.
- On doit prendre en compte le potentiel boost d'expérience que l'utilisateur peut avoir dans l'affichage. Après, ce n'est pas à ce composant de s'en occuper.
- On pourrait ajouter un boost d'expérience sur les challenges recommandés quand ils viennent d'être recommandés.
- Il doit voir sa progression sur ce challenge. 
  - Une fois qu'un challenge recommandé est commencé, il n'est plus automatiquement mis à jour.
- Chaque jour, on recommande un nouveau challenge.

Un challenge recommandé est présent pour développer les compétences d'un utilisateur. On peut développer un système qui affiché à quel point il est proche de compléter un concept. "This challenge increase your knowledge of <concept>. You are at <progress>%" 

On pourrait même transformer ce système en une roadmap d'une compétence où les challenges sont automatiquement définis (même si on garde de l'aléatoire) et on affiche tout le parcours de compétence de l'utilisateur. Une fois qu'il a complété un gros concept, on lui affiche un retour visuel et on lui donne un boost d'expérience.

On pourrait même avoir un slider avec plusieurs cartes qui affichent les différentes compétences qui sont en cours de développement. On pourrait avoir mon apprentissage sur la programmation orientée objets d'un côté puis sur FastAPI de l'autre.

- L'utilisateur peut cliquer sur un bouton pour voir sa progression dans la compétence en question.

Ce composant n'est donc pas réellement un composant de recommandation de challenges. C'est plutôt une continuité d'apprentissage en fonction de ses compétences. Les challenges sont en fait aléatoires puisqu'il en existe plusieurs pour un même concept.

*/
