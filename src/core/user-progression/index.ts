import { getPayload } from 'payload'
import config from '@payload-config'

export const getUserChallengeProgression = async (userId: string, challengeSlug: string) => {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'userChallengeProgression',
    where: {
      and: [
        {
          userId: {
            equals: userId,
          },
        },
        {
          challengeSlug: {
            equals: challengeSlug,
          },
        },
      ],
    },
  })

  return result.docs[0]
}

export const updateUserChallengeProgression = async (
  userId: string,
  challengeSlug: string,
  data: any,
) => {
  const payload = await getPayload({ config })

  // Check if record exists
  const existing = await getUserChallengeProgression(userId, challengeSlug)

  

  if (existing) {
    // Update existing record
    return await payload.update({
      collection: 'userChallengeProgression',
      id: existing.id,
      data,
    })
  } else {
    // Create new record
    return await payload.create({
      collection: 'userChallengeProgression',
      data: {
        userId,
        challengeSlug,
        ...data,
      },
    })
  }
}
