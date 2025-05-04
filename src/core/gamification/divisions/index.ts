'use server'

import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Division, UserInformation, WeeklyLeaderboardMember } from '@/payload-types'
import { getWeeklyUserExperience } from '../leaderboard' // Use the function from leaderboard index
import { getUserInformation } from '../../user' // Assuming a way to get user info by ID
import { Where } from 'payload'
import { startOfWeek } from 'date-fns'

/**
 * Finds the ID of the next higher or lower division based on rankOrder.
 *
 * @param currentDivisionId - The ID of the user's current division.
 * @param direction - Whether to find the division to 'promote' to or 'demote' to.
 * @returns The ID of the target division, or null if no higher/lower division exists.
 */
export const findTargetDivision = async (
  currentDivisionId: number,
  direction: 'promote' | 'demote',
): Promise<number | null> => {
  const payload = await getPayload({ config })

  try {
    // 1. Fetch all divisions and sort them by rankOrder
    const allDivisions = await payload.find({
      collection: 'divisions',
      sort: 'rankOrder', // Sort by the new field
      limit: 0,
      pagination: false,
    })

    if (!allDivisions.docs || allDivisions.docs.length === 0) {
      console.error('No divisions found in the system.')
      return null
    }

    // 2. Find the index of the current division
    const currentIndex = allDivisions.docs.findIndex(
      (division) => division.id === currentDivisionId,
    )

    if (currentIndex === -1) {
      console.error(`Current division with ID ${currentDivisionId} not found.`)
      return null
    }

    // 3. Determine the target index based on direction
    let targetIndex = -1
    if (direction === 'promote') {
      targetIndex = currentIndex + 1
    } else {
      // demote
      targetIndex = currentIndex - 1
    }

    // 4. Check bounds and return the target division ID or null
    if (targetIndex >= 0 && targetIndex < allDivisions.docs.length) {
      return allDivisions.docs[targetIndex].id
    } else {
      // Already at the highest or lowest division
      return null
    }
  } catch (error) {
    console.error('Error finding target division:', error)
    return null
  }
}

/**
 * Represents a ranked user entry in the division leaderboard.
 */
export type RankedLeaderboardUser = {
  rank: number
  userId: string
  name: string // From UserInformation
  avatar?: string // From UserInformation
  initials?: string // From UserInformation
  weeklyExperience: number
}

/**
 * Fetches the current user's division leaderboard group and ranks members based on live weekly XP.
 *
 * @param userId - The ID of the user whose leaderboard to fetch.
 * @returns An array of ranked users or null if the user isn't on a leaderboard.
 */
export const getUserDivisionLeaderboard = async (
  userId: string,
): Promise<RankedLeaderboardUser[] | null> => {
  const payload = await getPayload({ config })
  const now = new Date()

  try {
    // 1. Determine current week start date using the same logic as the creation action
    const currentWeekStartDate = startOfWeek(now, { weekStartsOn: 1 })
    currentWeekStartDate.setUTCHours(0, 0, 0, 0) // Ensure UTC midnight
    const currentWeekStartString = currentWeekStartDate.toISOString()

    // 2. Fetch all memberships for the user (potential improvement needed if many memberships)
    const allUserMemberships = await payload.find({
      collection: 'weekly-leaderboard-members',
      where: {
        userId: { equals: userId },
      },
      limit: 5, // Limit fetching old records, maybe only need recent ones?
      sort: '-createdAt', // Get the most recent first
      depth: 1, // IMPORTANT: Need leaderboard populated
    })

    // 3. Find the membership for the current week *in code*
    const currentMembership = allUserMemberships.docs.find((member) => {
      if (typeof member.leaderboard === 'object' && member.leaderboard !== null) {
        // Compare start dates. Convert DB date string to Date object for reliable comparison
        const leaderboardStartDate = new Date(member.leaderboard.startDate)
        // Comparison should now match because calculation is consistent
        return leaderboardStartDate.toISOString() === currentWeekStartString
      }
      return false
    })

    if (!currentMembership) {
      // Log the consistently calculated start date for debugging
      console.log(
        `User ${userId} membership not found for the current week starting ${currentWeekStartString}`,
      )
      return null
    }

    // Ensure leaderboard is populated
    if (
      typeof currentMembership.leaderboard !== 'object' ||
      currentMembership.leaderboard === null
    ) {
      console.error(`Leaderboard object not populated for member record ${currentMembership.id}`)
      return null
    }
    const leaderboardId = currentMembership.leaderboard.id

    // 4. Fetch all members of that specific leaderboard
    const allMembers = await payload.find({
      collection: 'weekly-leaderboard-members',
      where: {
        leaderboard: { equals: leaderboardId },
      },
      limit: 0, // Get all members
      pagination: false,
      depth: 0, // Don't need nested leaderboard info again
    })

    // 5. Fetch live weekly XP and basic user info for each member
    const memberDataPromises = allMembers.docs.map(async (member: WeeklyLeaderboardMember) => {
      const [weeklyXp, userInfo] = await Promise.all([
        getWeeklyUserExperience(member.userId, currentWeekStartDate, now), // Use current date as end for live data
        getUserInformation(member.userId).catch(() => null), // Fetch user info, handle potential errors
      ])
      return {
        userId: member.userId,
        weeklyExperience: weeklyXp,
        name: userInfo?.name || 'Unknown User',
        avatar: userInfo?.avatar || undefined,
        initials: userInfo?.initials || '??',
      }
    })

    const memberData = await Promise.all(memberDataPromises)

    // 6. Sort members by live weekly XP
    memberData.sort((a, b) => b.weeklyExperience - a.weeklyExperience)

    // 7. Assign ranks
    const rankedUsers: RankedLeaderboardUser[] = memberData.map((member, index) => ({
      rank: index + 1,
      ...member,
    }))

    return rankedUsers
  } catch (error) {
    console.error(`Error fetching leaderboard data for user ${userId}:`, error)
    return null
  }
}
