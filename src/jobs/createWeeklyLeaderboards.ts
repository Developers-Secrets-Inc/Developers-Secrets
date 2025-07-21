import type { TaskHandler } from 'payload'
import type {
  UserGamification as UserGamificationType,
  WeeklyDivisionLeaderboard,
} from '../payload-types'

// Handler logic moved from payload.config.ts
export const createWeeklyLeaderboardsHandler: TaskHandler<
  'createWeeklyDivisionLeaderboards'
> = async ({ req }) => {
  const payload = req.payload
  console.log('Starting createWeeklyDivisionLeaderboards task...')

  try {
    // 1. Calculate week start/end dates and identifier
    const now = new Date()
    // Adjust logic as needed to define your week start (e.g., Monday)
    const dayOfWeek = now.getUTCDay() // 0 = Sunday, 1 = Monday, ...
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // Calculate days to subtract to get to Monday
    const startDate = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + diffToMonday,
      0,
      0,
      0,
      0,
    )
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 7)

    // Create a week identifier (e.g., 2024-W30)
    const year = startDate.getUTCFullYear()
    const weekNum = Math.ceil(
      ((startDate.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7,
    )
    const weekIdentifier = `${year}-W${weekNum.toString().padStart(2, '0')}`

    console.log(
      `Processing week: ${weekIdentifier}, Start: ${startDate.toISOString()}, End: ${endDate.toISOString()}`,
    )

    // 2. Fetch all active users and their divisions
    // TODO: Add criteria for 'active' users if needed (e.g., recent activity)
    const allGamificationUsers = await payload.find({
      collection: 'user-gamification',
      limit: 0, // Get all users
      pagination: false,
      depth: 1, // Need division data
      where: {
        division: { exists: true }, // Only include users with a division assigned
      },
    })

    // 3. Group users by division
    const usersByDivision: Record<string, UserGamificationType[]> = {}
    allGamificationUsers.docs.forEach((user) => {
      const divisionId =
        typeof user.division === 'object' && user.division !== null
          ? user.division.id
          : user.division
      if (divisionId) {
        if (!usersByDivision[divisionId]) {
          usersByDivision[divisionId] = []
        }
        usersByDivision[divisionId].push(user)
      }
    })

    // 4. Process each division group
    const leaderboardGroupSize = 100 // Example group size
    for (const divisionId in usersByDivision) {
      const divisionUsers = usersByDivision[divisionId]
      console.log(`Processing division ${divisionId} with ${divisionUsers.length} users...`)

      // Shuffle users within the division for fair grouping (optional)
      // divisionUsers.sort(() => Math.random() - 0.5);

      // 5. Chunk users into leaderboard groups
      for (let i = 0; i < divisionUsers.length; i += leaderboardGroupSize) {
        const userGroup = divisionUsers.slice(i, i + leaderboardGroupSize)
        console.log(
          `  Creating leaderboard group ${Math.floor(i / leaderboardGroupSize) + 1} for division ${divisionId} with ${userGroup.length} users.`,
        )

        // 6. Create WeeklyDivisionLeaderboard record
        let newLeaderboard: WeeklyDivisionLeaderboard | null = null
        try {
          newLeaderboard = await payload.create({
            collection: 'weekly-division-leaderboards',
            data: {
              weekIdentifier,
              division: Number(divisionId), // Ensure divisionId is a number if needed
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              isProcessed: false,
            },
          })
        } catch (leaderboardError) {
          console.error(
            `  Failed to create leaderboard for division ${divisionId}, group ${Math.floor(i / leaderboardGroupSize) + 1}:`,
            leaderboardError,
          )
          continue // Skip to next group if leaderboard creation fails
        }

        // 7. Create WeeklyLeaderboardMember records for each user in the group
        const memberPromises = userGroup.map((user) => {
          return payload
            .create({
              collection: 'weekly-leaderboard-members',
              data: {
                leaderboard: newLeaderboard!.id, // Use the ID of the created leaderboard
                userId: user.userId,
                weeklyExperience: 0, // Initialize weekly XP
                // finalRank will be set by the end-of-week job
              },
            })
            .catch((memberError) => {
              console.error(
                `    Failed to add user ${user.userId} to leaderboard ${newLeaderboard!.id}:`,
                memberError,
              )
              // Decide how to handle partial failures - log, retry?
            })
        })

        await Promise.all(memberPromises)
        console.log(
          `  Finished processing group ${Math.floor(i / leaderboardGroupSize) + 1} for division ${divisionId}.`,
        )
      }
    }

    console.log('Finished createWeeklyDivisionLeaderboards task.')
    return { output: {} } // Indicate success with empty output
  } catch (error) {
    console.error('Error running createWeeklyDivisionLeaderboards task:', error)
    // Optionally re-throw or handle specific errors for retry logic
    throw error // Re-throwing will mark the job as failed
  }
}
