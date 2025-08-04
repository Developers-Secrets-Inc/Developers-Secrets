'use server'

import { query } from '@/core/functions'
import { isNone, Maybe, none, some } from '@/lib/maybe'
import { TIME } from '@/lib/time'
import { Challenge } from '@/payload-types'
import { Where } from 'payload'
import 'server-only'
import z from 'zod'

export const getChallengesWithoutCompleted = query({
  name: 'challenges-without-completed',
  args: z.object({ completedChallengesIds: z.array(z.number()), isPro: z.boolean() }),
  handler: async (ctx, args): Promise<Maybe<Challenge[]>> => {
    const whereClause: Where = { 
      id: { not_in: args.completedChallengesIds }, 
      draft: { equals: false } 
    }
    
    if (!args.isPro) {
      whereClause.isPro = { equals: false }
    }

    const documents = await ctx.payload.find({
      collection: 'challenges',
      where: whereClause,
    })

    return some(documents.docs)
  },
})

export const getChallenges = query({
  name: 'challenges',
  handler: async (ctx, _) => {
    const documents = await ctx.payload.find({
      collection: 'challenges',
    })

    return some(documents.docs)
  },
})

export const getChallengeBySlug = query({
  name: 'challenge-by-slug',
  args: z.object({ slug: z.string() }),
  handler: async (ctx, args): Promise<Maybe<Challenge>> => {
    const documents = await ctx.payload.find({
      collection: 'challenges',
      where: { slug: { equals: args.slug } },
      limit: 1,
    })

    return documents.docs[0] ? some(documents.docs[0]) : none()
  },
  revalidate: process.env.NODE_ENV === 'development' ? 5 : TIME.ONE_DAY,
})


export const getChallengeById = query({
  name: 'challenge-by-id',
  args: z.object({ id: z.number() }),
  handler: async (ctx, args): Promise<Maybe<Challenge>> => {
    const challenge = await ctx.payload.findByID({
      collection: 'challenges',
      id: args.id,
    })

    return challenge ? some(challenge) : none()
  },
  revalidate: process.env.NODE_ENV === 'development' ? 5 : TIME.ONE_DAY,
})


export const getRandomUncompletedChallenge = query({
  name: 'random-uncompleted-challenge',
  args: z.object({ userId: z.string(), isPro: z.boolean()}),
  handler: async (ctx, args): Promise<Challenge> => {

    const completedChallengeDocs = await ctx.payload.find({
      collection: 'userChallengeProgression',
      where: {
        userId: { equals: args.userId },
        completionStatus: { equals: 'completed' },
      },
      select: { challenge: true },
    })

    const completedChallengesIds = completedChallengeDocs.docs.map((progression) =>
      typeof progression.challenge === 'number' ? progression.challenge : progression.challenge.id,
    )

    const uncompletedChallenges = await getChallengesWithoutCompleted({
      completedChallengesIds,
      isPro: args.isPro,
    })

    if (isNone(uncompletedChallenges)) throw new Error('No uncompleted challenges found')

    const randomIndex = Math.floor(Math.random() * uncompletedChallenges.value.length)
    const randomChallenge = uncompletedChallenges.value[randomIndex]

    return randomChallenge
  },
})


/*

- getRandomUncompletedChallenge 
  - All challenge, not completed and which are not drafts

- On veut gérer les challenges aléatoires
- On veut gérer la récupération des challenges pour la table 
- On veut gérer la récupération de la quantité de challenges pour une catégorie




*/
