'use server'

import {
  addFollower,
  addFollowing,
  removeFollower,
  removeFollowing,
  addBlocked,
  isFollowing,
} from './follow'

export const toggleFollowUser = async (userId: string, targetUserId: string) => {
  try {
    const isCurrentlyFollowing = await isFollowing(userId, targetUserId)

    if (isCurrentlyFollowing) {
      // Unfollow
      await Promise.all([
        removeFollowing(userId, targetUserId),
        removeFollower(targetUserId, userId),
      ])
      return { success: true, isFollowing: false }
    } else {
      // Follow
      await Promise.all([addFollowing(userId, targetUserId), addFollower(targetUserId, userId)])
      return { success: true, isFollowing: true }
    }
  } catch (error) {
    console.error('Error toggling follow status:', error)
    return { success: false, error: (error as Error).message }
  }
}

// Create async wrappers for the server actions
export async function removeFollowerAction(userId: string, followerId: string) {
  return await removeFollower(userId, followerId)
}

export async function removeFollowingAction(userId: string, followingId: string) {
  return await removeFollowing(userId, followingId)
}

export async function addBlockedAction(userId: string, blockedId: string) {
  return await addBlocked(userId, blockedId)
}
