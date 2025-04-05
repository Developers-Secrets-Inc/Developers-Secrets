import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Brain, Trophy } from 'lucide-react'
import Link from 'next/link'

// Sample challenge data - replace with real data from your API
const sampleChallenge = {
  id: '1',
  title: 'Build a REST API',
  difficulty: 'medium',
  baseExperience: 150,
  concepts: ['Node.js', 'Express', 'REST', 'API Design'],
  slug: 'build-rest-api',
}

export const RecommendedChallenge = () => {
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
            <CardTitle className="text-xl">{sampleChallenge.title}</CardTitle>
            <Badge className={getDifficultyColor(sampleChallenge.difficulty)} variant="secondary">
              {sampleChallenge.difficulty}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <CardDescription className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>{sampleChallenge.baseExperience} XP</span>
            </CardDescription>
            <div className="flex flex-wrap gap-2">
              {sampleChallenge.concepts.map((concept) => (
                <Badge key={concept} variant="outline" className="flex items-center gap-1">
                  <Brain className="h-3 w-3" />
                  {concept}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <Button asChild>
          <Link href={`/challenges/${sampleChallenge.slug}`}>Start Challenge</Link>
        </Button>
      </div>
    </Card>
  )
}
