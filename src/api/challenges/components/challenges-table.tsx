import { UserChallengeProgression } from '@/payload-types'

type Challenge = {
  title: string
  slug: string
  difficulty: number
  baseExperience: number
  progression: UserChallengeProgression['completionStatus']
}

export const ChallengesTable = ({ initialChallenges }: { initialChallenges: Challenge[] }) => {
  return <></>
}
