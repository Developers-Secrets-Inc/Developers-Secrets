import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { getUser } from '@/core/user'
import { getRecommendedChallenges } from '@/core/skills/recommendations'
import { Brain, Trophy, SearchX } from 'lucide-react'
import Link from 'next/link'
import type { Challenge, Concept } from '@/payload-types'

const FALLBACK_KEY = 'general_recommendation' // Define the key for clarity

export const RecommendedChallenge = async () => {
  const user = await getUser()

  let recommendedChallenge: Challenge | null = null
  let recommendedSkillName: string | null = null
  let isFallbackRecommendation = false

  if (user && user.id) {
    const recommendationsBySkill = await getRecommendedChallenges(user.id)

    if (recommendationsBySkill[FALLBACK_KEY]?.length > 0) {
      // Handle fallback recommendation
      recommendedChallenge = recommendationsBySkill[FALLBACK_KEY][0]
      isFallbackRecommendation = true
      recommendedSkillName = null // Explicitly null for fallback
    } else {
      // Handle skill-based recommendation (existing logic)
      const skillNames = Object.keys(recommendationsBySkill)
      if (skillNames.length > 0) {
        const firstSkillName = skillNames[0]
        const challengesForFirstSkill = recommendationsBySkill[firstSkillName]
        if (challengesForFirstSkill && challengesForFirstSkill.length > 0) {
          recommendedChallenge = challengesForFirstSkill[0]
          recommendedSkillName = firstSkillName // Set the specific skill name
        }
      }
    }
  } else {
    console.warn('RecommendedChallenge: User not found.')
  }

  const getDifficultyColor = (difficulty: string | null | undefined) => {
    switch (difficulty?.toLowerCase()) {
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

  if (!recommendedChallenge) {
    // Display this only if NO challenge (skill-based or fallback) was found
    return (
      <Card className="w-full py-0 border-dashed border-border">
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-xl mb-1">No challenges available right now</CardTitle>
          <CardDescription className="mb-4">
            Please check back later or explore existing challenges!
          </CardDescription>
          {/* Optional: Link to explore challenges */}
          {/* <Button asChild><Link href="/challenges">Explore Challenges</Link></Button> */}
        </div>
      </Card>
    )
  }

  // Display the recommended challenge (either skill-based or fallback)
  return (
    <Card className="w-full py-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-4">
        {/* Left side */}
        <div className="flex-1 mr-6">
          {/* Conditional text based on recommendation type */}
          <div className="mb-2 text-sm font-medium text-primary">
            {isFallbackRecommendation
              ? 'Suggested for you:'
              : `Recommended for: ${recommendedSkillName || 'your progress'}`}
          </div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <CardTitle className="text-xl">{recommendedChallenge.title}</CardTitle>
            <Badge
              className={getDifficultyColor(recommendedChallenge.difficulty)}
              variant="secondary"
            >
              {recommendedChallenge.difficulty || 'N/A'}
            </Badge>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <CardDescription className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>{recommendedChallenge.baseExperience || '?'} XP</span>
            </CardDescription>
            {/* Concepts Display */}
            <div className="flex flex-wrap gap-2">
              {recommendedChallenge.concepts?.map(
                (conceptRelation: {
                  id?: string | number | null
                  concept: string | number | Concept | null
                }) => {
                  const concept =
                    typeof conceptRelation.concept === 'object' ? conceptRelation.concept : null
                  const conceptName = concept ? concept.name : 'Concept' // Safely access name
                  // Ensure conceptId is derived correctly, handling null/undefined
                  const conceptId =
                    typeof conceptRelation.concept === 'number'
                      ? conceptRelation.concept
                      : typeof conceptRelation.concept === 'object' && conceptRelation.concept?.id
                        ? conceptRelation.concept.id
                        : conceptRelation.id // Fallback to relation ID if concept isn't populated

                  return conceptId ? ( // Only render if we have a valid ID
                    <Badge
                      key={String(conceptId)} // Ensure key is string
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
        <div className="flex-shrink-0 mt-4 md:mt-0">
          <Button asChild>
            <Link href={`/challenges/${recommendedChallenge.slug}`}>Start Challenge</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}

/*  

On recommande un challenge en fonction du niveau de l'utilisateur et de ses compétences actuelles. Ce composant doit donc uniquement faire un appel à une fonction `getRecommendedChallenge`. 
- L'utilisateur doit comprendre quelles sont les compétences qui sont travaillées par ce challenge.
- On doit lui donner la possibilité de générer un nouveau challenge si celui-ci ne lui convient pas.
  - Pas intéressé, trop facile, trop difficile, etc.
- On doit prendre en compte le potentiel boost d'expérience que l'utilisateur peut avoir dans l'affichage. Après, ce n'est pas à ce composant de s'en occuper.
- On pourrait ajouter un boost d'expérience sur les challenges recommandés quand ils viennent d'être recommandés.
- Il doit voir sa progression sur ce challenge. 
  - Une fois qu'un challenge recommandé est commencé, il n'est plus automatiquement mis à jour.
- Chaque jour, on recommande un nouveau challenge.

Un challenge recommandé est présent pour développer les compétences d'un utilisateur. On peut développer un système qui affiché à quel point il est proche de compléter un concept. "This challenge increase your knowledge of <concept>. You are at <progress>%". 

On pourrait même transformer ce système en une roadmap d'une compétence où les challenges sont automatiquement définis (même si on garde de l'aléatoire) et on affiche tout le parcours de compétence de l'utilisateur. Une fois qu'il a complété un gros concept, on lui affiche un retour visuel et on lui donne un boost d'expérience.

On pourrait même avoir un slider avec plusieurs cartes qui affichent les différentes compétences qui sont en cours de développement. On pourrait avoir mon apprentissage sur la programmation orientée objets d'un côté puis sur FastAPI de l'autre.

- L'utilisateur peut cliquer sur un bouton pour voir sa progression dans la compétence en question.

Ce composant n'est donc pas réellement un composant de recommandation de challenges. C'est plutôt une continuité d'apprentissage en fonction de ses compétences. Les challenges sont en fait aléatoires puisqu'il en existe plusieurs pour un même concept.

*/
