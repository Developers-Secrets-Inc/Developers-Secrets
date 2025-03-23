import { getPayload } from 'payload'
import config from '@payload-config'

import { Challenge } from '@/types/challenge'
import { Challenge as PayloadChallenge } from '@/payload-types'

class ChallengeNotFoundError extends Error {
  constructor() {
    super('Challenge not found')
  }
}

export const getPreviousChallenge = async (slug: string): Promise<Challenge> => {
  const payload = await getPayload({ config })

  // Get all challenges sorted by creation date
  const challenges = await payload.find({
    collection: 'challenges',
    sort: 'createdAt',
  })

  const docs = challenges.docs

  // Find the index of the current challenge
  const currentIndex = docs.findIndex((challenge) => challenge.slug === slug)

  if (currentIndex <= 0) {
    // If it's the first challenge or not found, return the last challenge (circular navigation)
    return docs[docs.length - 1]
  }

  // Return the previous challenge
  return docs[currentIndex - 1]
}

export const getNextChallenge = async (slug: string): Promise<Challenge> => {
  const payload = await getPayload({ config })

  // Get all challenges sorted by creation date
  const challenges = await payload.find({
    collection: 'challenges',
    sort: 'createdAt',
  })

  const docs = challenges.docs

  // Find the index of the current challenge
  const currentIndex = docs.findIndex((challenge) => challenge.slug === slug)

  if (currentIndex === -1 || currentIndex === docs.length - 1) {
    // If it's the last challenge or not found, return the first challenge (circular navigation)
    return docs[0]
  }

  // Return the next challenge
  return docs[currentIndex + 1]
}

export const getRandomChallenge = async (excludeSlug?: string): Promise<Challenge> => {
  const payload = await getPayload({ config })

  // Get all challenges
  const challenges = await payload.find({
    collection: 'challenges',
    limit: 100, // Set a reasonable limit
  })

  let availableChallenges = challenges.docs

  // Exclude the current challenge if provided
  if (excludeSlug) {
    availableChallenges = availableChallenges.filter((challenge) => challenge.slug !== excludeSlug)
  }

  if (availableChallenges.length === 0) {
    throw new Error('No challenges available')
  }

  // Select a random challenge
  const randomIndex = Math.floor(Math.random() * availableChallenges.length)
  return availableChallenges[randomIndex]
}

export const getPayloadChallenge = async (id: number): Promise<PayloadChallenge> => {
  const payload = await getPayload({ config })
  const challenge = await payload.find({
    collection: 'challenges',
    where: {
      id: {
        equals: id,
      },
    },
  })
  if (!challenge.docs.length) {
    throw new ChallengeNotFoundError()
  }
  return challenge.docs[0]
}

export const getChallengeBySlug = async (slug: string): Promise<PayloadChallenge> => {
  const payload = await getPayload({ config })
  const challenge = await payload.find({
    collection: 'challenges',
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  if (!challenge.docs.length) {
    throw new ChallengeNotFoundError()
  }
  return challenge.docs[0]
}

export const addDescriptionComment = async (
  challengeSlug: string,
  comment: {
    authorId: string
    content: string
  },
) => {
  const payload = await getPayload({ config })

  // First, get the challenge to access existing comments
  const challenge = await getPayloadChallenge(challengeSlug)

  // Get existing comments or initialize an empty array if none exist
  const existingComments = challenge.description?.comments || []

  // Now update with both existing comments and the new one
  await payload.update({
    collection: 'challenges',
    where: {
      slug: {
        equals: challengeSlug,
      },
    },
    data: {
      description: {
        comments: [...existingComments, comment],
      },
    },
  })
}

export const addLikeToChallenge = async (slug: string): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await getPayloadChallenge(slug)
  const currentLikes = challenge.engagement?.likes || 0 // Get current likes
  await payload.update({
    collection: 'challenges',
    where: {
      slug: {
        equals: slug,
      },
    },
    data: {
      engagement: {
        likes: currentLikes + 1, // Increment likes by 1
      },
    },
  })
}

export const removeLikeFromChallenge = async (slug: string): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await getPayloadChallenge(slug)
  const currentLikes = challenge.engagement?.likes || 0 // Get current likes
  await payload.update({
    collection: 'challenges',
    where: {
      slug: {
        equals: slug,
      },
    },
    data: {
      engagement: {
        likes: Math.max(0, currentLikes - 1), // Decrement likes by 1, ensuring it doesn't go below 0
      },
    },
  })
}

export const addDislikeToChallenge = async (slug: string): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await getPayloadChallenge(slug)
  const currentDislikes = challenge.engagement?.dislikes || 0
  await payload.update({
    collection: 'challenges',
    where: {
      slug: {
        equals: slug,
      },
    },
    data: {
      engagement: {
        dislikes: currentDislikes + 1,
      },
    },
  })
}

export const removeDislikeFromChallenge = async (slug: string): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await getPayloadChallenge(slug)
  const currentDislikes = challenge.engagement?.dislikes || 0
  await payload.update({
    collection: 'challenges',
    where: {
      slug: {
        equals: slug,
      },
    },
    data: {
      engagement: {
        dislikes: Math.max(0, currentDislikes - 1),
      },
    },
  })
}

export const addRatingToChallenge = async (slug: string, rating: number): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await getPayloadChallenge(slug)

  const currentTotal = challenge.ratings?.total || 0
  const currentCount = challenge.ratings?.count || 0

  await payload.update({
    collection: 'challenges',
    where: {
      slug: {
        equals: slug,
      },
    },
    data: {
      ratings: {
        total: currentTotal + rating,
        count: currentCount + 1,
        // average will be calculated automatically by the hook
      },
    },
  })
}

export const updateRatingForChallenge = async (
  slug: string,
  oldRating: number,
  newRating: number,
): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await getPayloadChallenge(slug)

  const currentTotal = challenge.ratings?.total || 0

  await payload.update({
    collection: 'challenges',
    where: {
      slug: {
        equals: slug,
      },
    },
    data: {
      ratings: {
        total: currentTotal - oldRating + newRating,
        // Count stays the same since we're updating an existing rating
        count: challenge.ratings?.count || 0,
        // average will be calculated automatically by the hook
      },
    },
  })
}
