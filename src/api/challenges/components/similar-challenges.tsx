import { Challenge } from '@/payload-types'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

export const SimilarChallengesCards = ({
  challenges,
}: {
  challenges: Challenge['description']['similarChallenges']
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Similar Challenges</h3>
      <div className="flex flex-col gap-2">
        {(challenges ?? []).map((challenge) => (
          <SimilarChallengeCard key={challenge.id} challenge={challenge.challenge} />
        ))}
      </div>
    </div>
  )
}

export const SimilarChallengeCard = ({ challenge }: { challenge: Challenge }) => {
  const difficulty = challenge.difficulty
  const difficultyStyles = {
    very_easy: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500',
    easy: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
    medium: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
    hard: 'bg-red-500/10 border-red-500/20 text-red-500',
    horrible: 'bg-purple-500/10 border-purple-500/20 text-purple-500',
  }[difficulty]

  return (
    <Link href={`/challenges/${challenge.slug}`} className="block">
      <div className="border rounded-lg p-3 hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-colors group relative">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex-1">{challenge.title}</span>
          <Badge className={cn(difficultyStyles)} variant="secondary">
            {difficulty.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </Badge>
        </div>
      </div>
    </Link>
  )
}
