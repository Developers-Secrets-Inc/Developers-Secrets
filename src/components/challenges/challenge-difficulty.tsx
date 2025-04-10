import { Badge } from '@/components/ui/badge'

type Difficulty = 'easy' | 'medium' | 'hard' | 'horrible'

const DifficultyColors: Record<Difficulty, string> = {
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
      {difficulty}
    </Badge>
  )
}
