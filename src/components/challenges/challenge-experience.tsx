import { Badge } from '@/components/ui/badge'

interface ChallengeExperienceProps {
  experience: number
}

export function ChallengeExperience({ experience }: ChallengeExperienceProps) {
  return (
    <Badge
      variant="outline"
      className="bg-green-500/10 text-green-500 border-green-500/20 rounded-sm"
    >
      +{experience} XP
    </Badge>
  )
}
