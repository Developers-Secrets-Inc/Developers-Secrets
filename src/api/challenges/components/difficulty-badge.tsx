import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Challenge } from '@/payload-types'

export const ChallengeDifficultyBadge = ({
  difficulty,
}: {
  difficulty: Challenge['difficulty']
}) => {
  const styles = {
    very_easy: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    easy: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    hard: 'bg-red-500/10 text-red-500 border-red-500/20',
    horrible: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  }[difficulty]

  return (
    <Badge className={cn(styles)} variant="secondary">
      {difficulty.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
    </Badge>
  )
}
