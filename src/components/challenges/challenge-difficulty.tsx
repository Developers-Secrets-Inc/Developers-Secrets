import { Badge } from '@/components/ui/badge'

interface ChallengeDifficultyProps {
  difficulty: 'easy' | 'medium' | 'hard' | 'horrible'
}

export function ChallengeDifficulty({ difficulty }: ChallengeDifficultyProps) {
  const getColorByDifficulty = () => {
    switch (difficulty) {
      case 'easy':
        return 'green'
      case 'medium':
        return 'blue'
      case 'hard':
        return 'orange'
      case 'horrible':
        return 'red'
      default:
        return 'gray'
    }
  }

  const color = getColorByDifficulty()

  return (
    <Badge
      variant="outline"
      className={`bg-${color}-500/10 text-${color}-500 border-${color}-500/20 rounded-sm capitalize`}
    >
      {difficulty}
    </Badge>
  )
}
