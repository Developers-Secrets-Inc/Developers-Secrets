import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { getRandomChallenge } from '@/core/challenges'
import { Brain, Trophy } from 'lucide-react'
import Link from 'next/link'

export const RecommendedChallenge = async () => {
  const challenge = await getRandomChallenge()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-500/10 text-emerald-500'
      case 'medium':
        return 'bg-amber-500/10 text-amber-500'
      case 'hard':
        return 'bg-red-500/10 text-red-500'
      default:
        return 'bg-slate-500/10 text-slate-500'
    }
  }

  return (
    <Card className="w-full py-0">
      <div className="flex justify-between items-center p-6">
        <div className="flex-1 mr-6">
          <div className="flex items-center gap-2 mb-1.5">
            <CardTitle className="text-xl">{challenge.title}</CardTitle>
            <Badge className={getDifficultyColor(challenge.difficulty)} variant="secondary">
              {challenge.difficulty}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <CardDescription className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>{challenge.baseExperience} XP</span>
            </CardDescription>
            <div className="flex flex-wrap gap-2">
              {challenge.concepts?.map((conceptObj) => (
                <Badge key={conceptObj.id} variant="outline" className="flex items-center gap-1">
                  <Brain className="h-3 w-3" />
                  {conceptObj.concept}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <Button asChild>
          <Link href={`/challenges/${challenge.slug}`}>Start Challenge</Link>
        </Button>
      </div>
    </Card>
  )
}
