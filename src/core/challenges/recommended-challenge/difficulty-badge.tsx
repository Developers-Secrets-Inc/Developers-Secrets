import { Badge } from '@/components/ui/badge'
import { Challenge } from '@/payload-types'

type ChallengeDifficulty = Challenge['difficulty']
type DifficultyColor = 'cyan' | 'emerald' | 'amber' | 'red' | 'purple'

// Define a type for the specific class string pattern
type DifficultyClass = `bg-${DifficultyColor}-500/10 text-${DifficultyColor}-500`

// Define the mapping as a constant
const difficultiesClasses: Record<ChallengeDifficulty, DifficultyClass> = {
  very_easy: 'bg-cyan-500/10 text-cyan-500',
  easy: 'bg-emerald-500/10 text-emerald-500',
  medium: 'bg-amber-500/10 text-amber-500',
  hard: 'bg-red-500/10 text-red-500',
  horrible: 'bg-purple-500/10 text-purple-500',
}

const FormattedDifficulty = ({ difficulty }: { difficulty: ChallengeDifficulty }) => {
  const DIFFICULTY_WITHOUT_UNDERSCORES = difficulty.replace('_', ' ')
  const CAPITALIZED_DIFFICULTY = DIFFICULTY_WITHOUT_UNDERSCORES.replace(/\b\w/g, (l) => l.toUpperCase())

  return <>{CAPITALIZED_DIFFICULTY}</>
}

const ChallengeDifficultyBadge = ({ difficulty }: { difficulty: ChallengeDifficulty }) => {
  return (
    <Badge variant="secondary" className={difficultiesClasses[difficulty]}>
      <FormattedDifficulty difficulty={difficulty} />
    </Badge>
  )
}

export { ChallengeDifficultyBadge }
