'use server'

import { User } from '@/types/user'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getUserById } from '../user'
import { UserFollowingInformation } from '@/payload-types'

const getFollowInformations = async (userId: string): Promise<UserFollowingInformation | null> => {
  try {
    const payload = await getPayload({ config })

    // Chercher d'abord les informations existantes
    const existingInfo = await payload.find({
      collection: 'user-following-informations',
      where: {
        userId: { equals: userId },
      },
    })

    if (existingInfo.docs.length > 0) {
      return existingInfo.docs[0]
    }

    // Si aucune information n'existe, créer un nouvel enregistrement
    try {
      const newFollowInfo = await payload.create({
        collection: 'user-following-informations',
        data: {
          userId,
          followers: [],
          following: [],
          blockedUsers: [],
        },
      })
      return newFollowInfo
    } catch (error) {
      console.error('Error creating follow information:', error)
      return null
    }
  } catch (error) {
    console.error('Error in getFollowInformations:', error)
    return null
  }
}

export const getFollowers = async (userId: string): Promise<User[]> => {
  try {
    const followInformations = await getFollowInformations(userId)
    if (!followInformations?.followers) {
      return []
    }

    const followers = await Promise.all(
      followInformations.followers.map(async (follower) => {
        if (!follower?.id) return null
        try {
          const user = await getUserById(follower.id)
          return user.success ? user.value : null
        } catch (error) {
          console.error(`Error fetching follower ${follower.id}:`, error)
          return null
        }
      }),
    )

    return followers.filter((user): user is User => user !== null)
  } catch (error) {
    console.error('Error in getFollowers:', error)
    return []
  }
}

export const getFollowing = async (userId: string): Promise<User[]> => {
  try {
    const followInformations = await getFollowInformations(userId)
    if (!followInformations?.following) {
      return []
    }

    const following = await Promise.all(
      followInformations.following.map(async (following) => {
        if (!following?.id) return null
        try {
          const user = await getUserById(following.id)
          return user.success ? user.value : null
        } catch (error) {
          console.error(`Error fetching following ${following.id}:`, error)
          return null
        }
      }),
    )

    return following.filter((user): user is User => user !== null)
  } catch (error) {
    console.error('Error in getFollowing:', error)
    return []
  }
}

export const getBlockedUsers = async (userId: string): Promise<User[]> => {
  const followInformations = await getFollowInformations(userId)
  if (!followInformations) {
    return []
  }

  const blockedUsers = followInformations.blockedUsers || []

  return await Promise.all(
    blockedUsers.map(async (blockedUser) => {
      if (!blockedUser.id) throw new Error('User ID is undefined')
      const user = await getUserById(blockedUser.id)

      if (user.success) {
        return user.value
      }

      throw new Error('User not found')
    }),
  )
}

export const isFollower = async (userId: string, followerId: string): Promise<boolean> => {
  const followers = await getFollowers(userId)
  return followers.some((follower) => follower.id === followerId)
}

export const isFollowing = async (userId: string, followingId: string): Promise<boolean> => {
  const following = await getFollowing(userId)
  return following.some((following) => following.id === followingId)
}

export const isBlocked = async (userId: string, blockedId: string): Promise<boolean> => {
  const blocked = await getBlockedUsers(userId)
  return blocked.some((blocked) => blocked.id === blockedId)
}

export const getFollowersCount = async (userId: string): Promise<number> => {
  const followers = await getFollowers(userId)
  return followers.length
}

export const getFollowingCount = async (userId: string): Promise<number> => {
  const following = await getFollowing(userId)
  return following.length
}

export const getBlockedCount = async (userId: string): Promise<number> => {
  const blocked = await getBlockedUsers(userId)
  return blocked.length
}

export const addFollower = async (userId: string, followerId: string): Promise<void> => {
  if (userId === followerId) throw new Error('You cannot follow yourself')
  if (await isFollower(userId, followerId)) throw new Error('You are already following this user')

  const followInformations = await getFollowInformations(userId)
  if (!followInformations) {
    throw new Error('Failed to get or create follow information')
  }

  const followers = followInformations.followers || []
  followers.push({ id: followerId })

  const payload = await getPayload({ config })

  await payload.update({
    collection: 'user-following-informations',
    id: followInformations.id,
    data: {
      followers,
    },
  })
}

export const addFollowing = async (userId: string, followingId: string): Promise<void> => {
  if (userId === followingId) throw new Error('You cannot follow yourself')
  if (await isFollowing(userId, followingId)) throw new Error('You are already following this user')

  const followInformations = await getFollowInformations(userId)
  if (!followInformations) {
    throw new Error('Failed to get or create follow information')
  }

  const following = followInformations.following || []
  following.push({ id: followingId })

  const payload = await getPayload({ config })

  await payload.update({
    collection: 'user-following-informations',
    id: followInformations.id,
    data: { following },
  })
}

export const addBlocked = async (userId: string, blockedId: string): Promise<void> => {
  if (userId === blockedId) throw new Error('You cannot block yourself')
  if (await isBlocked(userId, blockedId)) throw new Error('You are already blocking this user')

  const followInformations = await getFollowInformations(userId)
  if (!followInformations) {
    throw new Error('Failed to get or create follow information')
  }

  const blockedUsers = followInformations.blockedUsers || []
  blockedUsers.push({ id: blockedId })

  const payload = await getPayload({ config })

  await payload.update({
    collection: 'user-following-informations',
    id: followInformations.id,
    data: { blockedUsers },
  })
}

export const removeFollower = async (userId: string, followerId: string): Promise<void> => {
  const followInformations = await getFollowInformations(userId)
  if (!followInformations) {
    return // Rien à supprimer si pas d'informations
  }

  const followers = followInformations.followers || []
  const newFollowers = followers.filter((follower) => follower.id !== followerId)

  const payload = await getPayload({ config })

  await payload.update({
    collection: 'user-following-informations',
    id: followInformations.id,
    data: { followers: newFollowers },
  })
}

export const removeFollowing = async (userId: string, followingId: string): Promise<void> => {
  const followInformations = await getFollowInformations(userId)
  if (!followInformations) {
    return // Rien à supprimer si pas d'informations
  }

  const following = followInformations.following || []
  const newFollowing = following.filter((following) => following.id !== followingId)

  const payload = await getPayload({ config })

  await payload.update({
    collection: 'user-following-informations',
    id: followInformations.id,
    data: { following: newFollowing },
  })
}

export const removeBlocked = async (userId: string, blockedId: string): Promise<void> => {
  const followInformations = await getFollowInformations(userId)
  if (!followInformations) {
    return // Rien à supprimer si pas d'informations
  }

  const blockedUsers = followInformations.blockedUsers || []
  const newBlockedUsers = blockedUsers.filter((blocked) => blocked.id !== blockedId)

  const payload = await getPayload({ config })

  await payload.update({
    collection: 'user-following-informations',
    id: followInformations.id,
    data: { blockedUsers: newBlockedUsers },
  })
}
