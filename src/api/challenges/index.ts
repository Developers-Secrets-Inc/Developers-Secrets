'use server'

import { Challenge } from '@/payload-types'
import 'server-only'
import { find } from '..'
import { query } from '@/core/functions'
import z from 'zod'
import { challenges } from '@/payload-generated-schema'
import { eq } from '@payloadcms/db-postgres/drizzle'
import { TIME } from '@/lib/time'
import { Maybe, some, none } from '@/lib/maybe'

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
      baseExperience: true,
    },
  })
  const uncompletedChallenges = challengeDocs.docs

  const randomIndex = Math.floor(Math.random() * uncompletedChallenges.length)
  const randomChallenge = uncompletedChallenges[randomIndex]

  return randomChallenge
}

export const getChallengeBySlug = query({
  name: 'challenge-by-slug',
  args: z.object({ slug: z.string() }),
  handler: async (ctx, args): Promise<Maybe<Challenge>> => {
    const db = ctx.drizzle
    const result = await db.select().from(challenges).where(eq(challenges.slug, args.slug)).limit(1)

    return result[0] ? some(result[0]) : none()
  },
  revalidate: TIME.ONE_DAY,
})
