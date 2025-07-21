'use server'

import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Where } from 'payload'
import { formatISO, startOfWeek, endOfWeek } from 'date-fns'

// Helper function to get ISO week number
function getISOWeek(date: Date): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  // Set to nearest Thursday: current date + 4 - current day number (0=Sun, 1=Mon, ... 6=Sat)
  // Adjust day number to ISO 8601 (Mon=1, ..., Sun=7)
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  // Get year of Thursday
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  // Return week number & year
  return { year: d.getUTCFullYear(), week: weekNo }
}

export async function manuallyCreateWeeklyDivisionLeaderboards(): Promise<{
  success: boolean
  message: string
  details?: string[]
}> {
  const payload = await getPayload({ config })
  const now = new Date()
  // Ensure Monday is the start of the week, calculate in UTC
  const startDate = startOfWeek(now, { weekStartsOn: 1 })
  startDate.setUTCHours(0, 0, 0, 0) // Explicitly set to UTC midnight

  const endDate = endOfWeek(now, { weekStartsOn: 1 })
  endDate.setUTCHours(23, 59, 59, 999) // Explicitly set to end of Sunday UTC

  // Calculate the correct YYYY-W## identifier using the helper
  const isoWeekData = getISOWeek(now)
  const weekIdentifier = `${isoWeekData.year}-W${String(isoWeekData.week).padStart(2, '0')}`

  const details: string[] = []

  try {
    details.push(
      `Processing for week: ${weekIdentifier} (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})`,
    )

    // 1. Fetch all active UserGamification entries with their division populated
    const userGamifications = await payload.find({
      collection: 'user-gamification',
      where: {
        // Add any criteria for 'active' users if necessary
        // e.g., 'status': { equals: 'active' }
      },
      limit: 0, // Get all users
      pagination: false,
      depth: 1, // Need the division object
      overrideAccess: true, // Bypass access control for dev action
    })

    if (!userGamifications.docs || userGamifications.docs.length === 0) {
      return { success: true, message: 'No active users found to create leaderboards for.' }
    }

    // 2. Group users by division ID
    const usersByDivision: Record<string, typeof userGamifications.docs> = {}
    userGamifications.docs.forEach((ug) => {
      // Ensure division is populated and is an object with an id
      if (typeof ug.division === 'object' && ug.division !== null && ug.division.id) {
        const divisionId = ug.division.id.toString()
        if (!usersByDivision[divisionId]) {
          usersByDivision[divisionId] = []
        }
        usersByDivision[divisionId].push(ug)
      } else {
        // console.warn(`UserGamification ${ug.id} missing populated division object.`);
      }
    })

    // 3. Process each division group
    for (const divisionId in usersByDivision) {
      const divisionUsers = usersByDivision[divisionId]
      // Add null check for division before accessing name
      const divisionObject =
        typeof divisionUsers[0].division === 'object' ? divisionUsers[0].division : null
      const divisionName = divisionObject ? divisionObject.name : `ID ${divisionId}`

      details.push(`Processing Division: ${divisionName} (${divisionUsers.length} users)`)

      // 4. Check if leaderboard already exists for this division and week
      const existingLeaderboard = await payload.find({
        collection: 'weekly-division-leaderboards',
        where: {
          division: { equals: parseInt(divisionId, 10) }, // Convert string ID to number for query
          weekIdentifier: { equals: weekIdentifier },
        },
        limit: 1,
        pagination: false,
        overrideAccess: true, // Bypass access control for dev action
      })

      if (existingLeaderboard.docs.length > 0) {
        details.push(
          `  - Leaderboard already exists (ID: ${existingLeaderboard.docs[0].id}). Skipping creation.`,
        )
        continue // Skip to the next division
      }

      // 5. Create the new WeeklyDivisionLeaderboard record
      details.push(`  - Creating new leaderboard...`)
      const newLeaderboard = await payload.create({
        collection: 'weekly-division-leaderboards',
        data: {
          division: parseInt(divisionId, 10), // Convert string ID to number
          weekIdentifier: weekIdentifier, // Store the YYYY-W## identifier
          startDate: startDate.toISOString(), // Store the precise UTC start time
          endDate: endDate.toISOString(), // Store the precise UTC end time
          isProcessed: false,
        },
        overrideAccess: true,
      })
      details.push(`  - Leaderboard created (ID: ${newLeaderboard.id}).`)

      // 6. Prepare and create WeeklyLeaderboardMembers records
      const memberDocs = divisionUsers
        .map((ug) => ({
          leaderboard: newLeaderboard.id,
          // Ensure ug.userId exists and is a string
          userId: typeof ug.userId === 'string' ? ug.userId : '',
          weeklyExperience: 0,
        }))
        .filter((member) => member.userId !== '') // Filter out entries with missing userId

      if (memberDocs.length > 0) {
        details.push(`  - Creating ${memberDocs.length} member records...`)
        let createdCount = 0
        for (const memberData of memberDocs) {
          try {
            await payload.create({
              collection: 'weekly-leaderboard-members',
              data: memberData,
              overrideAccess: true,
            })
            createdCount++
          } catch (memberError) {
            console.error(
              `Error creating member for user ${memberData.userId} in leaderboard ${newLeaderboard.id}:`,
              memberError,
            )
            details.push(`  - FAILED creating member for user ${memberData.userId}.`)
          }
        }
        details.push(`  - Successfully created ${createdCount} member records.`)
      } else {
        details.push(`  - No valid members to add for this division (userId might be missing).`)
      }
    }

    return {
      success: true,
      message: `Weekly division leaderboards creation process finished for ${weekIdentifier}.`,
      details: details,
    }
  } catch (error: any) {
    console.error('Error manually creating weekly division leaderboards:', error)
    return {
      success: false,
      message: 'Failed to create weekly division leaderboards.',
      details: [...details, `Error: ${error.message}`],
    }
  }
}
