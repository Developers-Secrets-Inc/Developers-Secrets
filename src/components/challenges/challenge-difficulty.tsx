import { Badge } from '@/components/ui/badge'

type Difficulty = 'very_easy' | 'easy' | 'medium' | 'hard' | 'horrible'

const DifficultyColors: Record<Difficulty, string> = {
  very_easy: 'cyan',
  easy: 'green',
  medium: 'blue',
  hard: 'orange',
  horrible: 'red',
}

export const Difficulty = ({ difficulty }: { difficulty: Difficulty }) => {
  const COLOR = DifficultyColors[difficulty]

  return (
    <Badge
      variant="outline"
      className={`bg-${COLOR}-500/10 text-${COLOR}-500 border-${COLOR}-500/20 rounded-sm capitalize`}
    >
      {difficulty.replace('_', ' ')}
    </Badge>
  )
}
