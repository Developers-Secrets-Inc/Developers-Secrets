'use server'

import 'server-only'

import config from '@payload-config'
import { getPayload } from 'payload'

import { getChallengeById } from './challenge-queries'

export const addLikeToChallenge = async (challengeId: number): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await getChallengeById(challengeId)
  const currentLikes = challenge.engagement?.likes || 0 // Get current likes
  await payload.update({
    collection: 'challenges',
    id: challenge.id,
    data: {
      engagement: {
        likes: currentLikes + 1, // Increment likes by 1
      },
    },
  })
}



export const removeLikeFromChallenge = async (challengeId: number): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await getChallengeById(challengeId)
  const currentLikes = challenge.engagement?.likes || 0 // Get current likes
  await payload.update({
    collection: 'challenges',
    id: challenge.id,
    data: {
      engagement: {
        likes: Math.max(0, currentLikes - 1), // Decrement likes by 1, ensuring it doesn't go below 0
      },
    },
  })
}

export const addDislikeToChallenge = async (challengeId: number): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await getChallengeById(challengeId)
  const currentDislikes = challenge.engagement?.dislikes || 0
  await payload.update({
    collection: 'challenges',
    id: challenge.id,
    data: {
      engagement: {
        dislikes: currentDislikes + 1,
      },
    },
  })
}

export const removeDislikeFromChallenge = async (challengeId: number): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await getChallengeById(challengeId)
  const currentDislikes = challenge.engagement?.dislikes || 0
  await payload.update({
    collection: 'challenges',
    id: challenge.id,
    data: {
      engagement: {
        dislikes: Math.max(0, currentDislikes - 1),
      },
    },
  })
}




export const addRatingToChallenge = async (challengeId: number, rating: number): Promise<void> => {
    const payload = await getPayload({ config })
    const challenge = await getChallengeById(challengeId)
  
    const currentTotal = challenge.ratings?.total || 0
    const currentCount = challenge.ratings?.count || 0
  
    await payload.update({
      collection: 'challenges',
      id: challenge.id,
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
    challengeId: number,
    oldRating: number,
    newRating: number,
  ): Promise<void> => {
    const payload = await getPayload({ config })
    const challenge = await getChallengeById(challengeId)
  
    const currentTotal = challenge.ratings?.total || 0
  
    await payload.update({
      collection: 'challenges',
      id: challenge.id,
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
