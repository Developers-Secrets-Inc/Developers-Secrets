'use server'

import { query } from '@/core/functions'
import 'server-only'
import z from 'zod'
import { getChallenges } from '..'
import { isNone, none, some } from '@/lib/maybe'
import { TIME } from '@/lib/time'

const getAllChallengeSlugs = query({
  name: 'all-challenge-slugs',
  handler: async (ctx, args) => {
    const documents = await ctx.payload.find({
      collection: 'challenges',
      select: { slug: true },
      depth: 0,
      pagination: false,
    })

    return some(documents.docs)
  },
})

export const getPreviousChallenge = query({
  name: 'previous-challenge',
  args: z.object({ challengeId: z.number() }),
  handler: async (ctx, args) => {
    const challenges = await getAllChallengeSlugs()

    if (isNone(challenges)) {
      return none()
    }

    const currentChallenge = challenges.value.find((c) => c.id === args.challengeId)
    if (!currentChallenge) {
      return none()
    }

    const currentChallengeIndex = challenges.value.indexOf(currentChallenge)
    const previousIndex =
      (currentChallengeIndex - 1 + challenges.value.length) % challenges.value.length
    const previousChallenge = challenges.value[previousIndex]
    return some(previousChallenge)
  },
  revalidate: process.env.NODE_ENV === 'development' ? 5 : TIME.ONE_DAY,
})

export const getNextChallenge = query({
  name: 'next-challenge',
  args: z.object({ challengeId: z.number() }),
  handler: async (ctx, args) => {
    const challenges = await getAllChallengeSlugs()

    if (isNone(challenges)) return none()

    const currentChallenge = challenges.value.find((c) => c.id === args.challengeId)

    if (!currentChallenge) return none()

    const currentChallengeIndex = challenges.value.indexOf(currentChallenge)
    const nextIndex = (currentChallengeIndex + 1) % challenges.value.length
    const nextChallenge = challenges.value[nextIndex]
    return some(nextChallenge)
  },
  revalidate: process.env.NODE_ENV === 'development' ? 5 : TIME.ONE_DAY,
})

export const getRandomChallenge = query({
  name: 'random-challenge',
  handler: async (ctx, args) => {
    const challenges = await getAllChallengeSlugs()

    if (isNone(challenges)) return none()

    const randomChallenge = challenges.value[Math.floor(Math.random() * challenges.value.length)]
    return some(randomChallenge)
  },
  revalidate: process.env.NODE_ENV === 'development' ? 5 : TIME.ONE_DAY,
})
