import { CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type ChallengeHeaderProps = {
  title?: string
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  tags?: string[]
  xp?: number
  status?: 'Attempted' | 'Completed' | 'Not Attempted'
}

export function ChallengeHeader({
  title = 'Count Number of Maximum Bitwise-OR Subsets',
  difficulty = 'Medium',
  tags = ['Bit Manipulation', 'Dynamic Programming', 'Recursion'],
  xp = 50,
  status = 'Attempted',
}: ChallengeHeaderProps) {
  // Mapping des couleurs par difficulté
  const difficultyColorMap = {
    Easy: 'green',
    Medium: 'yellow',
    Hard: 'red',
  }

  const color = difficultyColorMap[difficulty]

  // Mapping des couleurs par statut
  const statusColorMap = {
    Attempted: 'amber',
    Completed: 'green',
    'Not Attempted': 'gray',
  }

  const statusColor = statusColorMap[status]

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className={`flex items-center gap-1.5 text-${statusColor}-500`}>
          <CheckCircle size={16} />
          <span className="text-sm font-medium">{status}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge
          variant="outline"
          className={`bg-${color}-500/10 text-${color}-500 border-${color}-500/20 rounded-sm`}
        >
          {difficulty}
        </Badge>
        {xp && (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-500 border-green-500/20 rounded-sm"
          >
            +{xp} XP
          </Badge>
        )}
        {tags.map((tag) => (
          <Badge key={tag} variant="outline" className="rounded-sm">
            {tag}
          </Badge>
        ))}
      </div>
    </>
  )
}
