import { z } from 'zod'

import { UserSolution } from '@/payload-types'
import { getChallengeSolutions } from '..'
import { CommunitySolutionCard } from './user-solution-card'
import { User } from '@/core/users/types'
import { getUserById } from '@/core/user'
import { isError } from '@/core/user/result'

const ChallengeSchema = z.object({
  id: z.number().int().positive(),
  slug: z.string().min(1),
})
type Challenge = z.infer<typeof ChallengeSchema>

const validateChallenge = (challenge: Challenge): Challenge => {
  const result = ChallengeSchema.safeParse(challenge)
  if (!result.success) {
    throw new Error('Invalid challenge')
  }
  return result.data
}

type CardUserSolution = UserSolution & {
  user: User
  upvotes: number
  downvotes: number
  url: string
}

const convertUserSolutionToCardUserSolution = async (
  userSolution: UserSolution,
  challenge: Challenge,
): Promise<CardUserSolution> => {
  const user = await getUserById(userSolution.authorId)

  if (isError(user)) {
    throw new Error('User not found')
  }

  return {
    ...userSolution,
    user: user.value,
    upvotes: userSolution.votes?.filter((vote) => vote.status === 'upvote').length || 0,
    downvotes: userSolution.votes?.filter((vote) => vote.status === 'downvote').length || 0,
    url: `/challenges/${challenge.slug}/solutions/${userSolution.id}`,
  }
}

export const UsersSolutionsCards = async ({ challenge }: { challenge: Challenge }) => {
  const validatedChallenge = validateChallenge(challenge)

  const usersSolutions = await getChallengeSolutions(validatedChallenge.id)

  const cardUserSolutions = await Promise.all(
    usersSolutions.map((userSolution) =>
      convertUserSolutionToCardUserSolution(userSolution, validatedChallenge),
    ),
  )

  return (
    <div>
      {cardUserSolutions.map((cardUserSolution) => (
        <CommunitySolutionCard key={cardUserSolution.id} solution={cardUserSolution} />
      ))}
    </div>
  )
}

const NoSolutionFound = () => {
  return (
    <div>
      <h1>No solution found</h1>
    </div>
  )
}
