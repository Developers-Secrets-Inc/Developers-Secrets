'use server'

import { Challenge } from '@/payload-types'
import 'server-only'
import { find } from '..'

export const getRandomUncompletedChallenge = async (
  userId: string,
): Promise<{
  id: number
  title: string
  slug: string
  difficulty: Challenge['difficulty']
  baseExperience?: number | null
}> => {
  const completedChallengeDocs = await find({
    collection: 'userChallengeProgression',
    where: {
      userId: { equals: userId },
      completionStatus: { equals: 'completed' },
    },
    select: { challenge: true },
  })

  const completedChallengeIds = completedChallengeDocs.docs.map((progression) =>
    typeof progression.challenge === 'number' ? progression.challenge : progression.challenge.id,
  )

  const challengeDocs = await find({
    collection: 'challenges',
    where: { id: { not_in: completedChallengeIds } },
    select: {
        title: true,
        slug: true,
        difficulty: true, 
        baseExperience: true
    }
  })
  const uncompletedChallenges = challengeDocs.docs

  const randomIndex = Math.floor(Math.random() * uncompletedChallenges.length)
  const randomChallenge = uncompletedChallenges[randomIndex]

  return randomChallenge
  
}
