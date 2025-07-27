import { CheckCircle2Icon, Circle, CircleDotIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type ChallengeStatusColor = 'emerald' | 'amber' | 'gray'

const ChallengeStatusIcon = ({
  icon: Icon,
  color,
}: {
  icon: LucideIcon
  color: ChallengeStatusColor
}) => {
  return <Icon className={`h-4 w-4 text-${color}-500`} />
}

export const ChallengesStatusIcons = {
    Completed: <ChallengeStatusIcon icon={CheckCircle2Icon} color='emerald' />,
    InProgress: <ChallengeStatusIcon icon={CircleDotIcon} color='amber' />,
    NotStarted: <ChallengeStatusIcon icon={Circle} color='gray' />
}