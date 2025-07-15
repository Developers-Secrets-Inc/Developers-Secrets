'use server'

import { find } from '@/api'
import { Challenge, ChallengeCategory, UserChallengeProgression } from '@/payload-types'
import 'server-only'

export type PopulatedChallengeInCategory = {
  id: number
  title: string
  slug: string
  difficulty: Challenge['difficulty']
  baseExperience: number
}

export type ChallengeCategoryPartWithPopulatedChallenges = Omit<
  NonNullable<ChallengeCategory['parts']>[number],
  'challenges'
> & {
  challenges: PopulatedChallengeInCategory[]
}

export type ChallengeCategoryWithPopulatedChallenges = Omit<ChallengeCategory, 'parts'> & {
  parts: ChallengeCategoryPartWithPopulatedChallenges[]
}

export const getChallengeCategories = async (): Promise<ChallengeCategory[]> => {
  const categories = await find({
    collection: 'challenge-categories',
    depth: 0,
  })

  return categories.docs
}

export const getChallengeCategoryBySlug = async (
  slug: string,
): Promise<ChallengeCategoryWithPopulatedChallenges> => {
  const categoriesDocs = await find({
    collection: 'challenge-categories',
    where: { slug: { equals: slug } },
    depth: 0,
  })

  const category = categoriesDocs.docs[0]

  const parts = await Promise.all(
    (category.parts ?? []).map(async (part) => {
      return {
        name: part.name,
        description: part.description,
        challenges: await Promise.all(
          part.challenges.map(async (challenge) => {
            const getChallenge = async (
              challengeId: number,
            ): Promise<PopulatedChallengeInCategory> => {
              const challengesDocs = await find({
                collection: 'challenges',
                where: { id: { equals: challengeId } },
                select: {
                  title: true,
                  slug: true,
                  difficulty: true,
                  baseExperience: true,
                },
              })

              const challenge = challengesDocs.docs[0]
              return { ...challenge, baseExperience: challenge.baseExperience ?? 50 }
            }

            return await getChallenge(typeof challenge === 'number' ? challenge : challenge.id)
          }),
        ),
      }
    }),
  )

  return { ...category, parts: parts }
}
