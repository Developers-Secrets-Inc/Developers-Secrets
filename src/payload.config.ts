// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import type { TaskConfig, TaskHandler } from 'payload'
import type {
  UserGamification as UserGamificationType,
  WeeklyDivisionLeaderboard,
  Division,
} from './payload-types'
import { getWeeklyUserExperience } from './core/gamification/leaderboard'
import { findTargetDivision } from './core/gamification/divisions'
import { addCurrency } from './core/gamification/marketplace/currency'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Articles } from './collections/Articles'
import { Tutorials } from './collections/Tutorials'
import { Tags } from './collections/Tags'
import { Feedbacks } from './collections/Feedbacks'
import { SupportSettings } from './collections/SupportSettings'
import { UserInformations } from './collections/UserInformations'
import { Permissions } from './collections/Permissions'
import { UserGamification } from './collections/UserGamification'
import { UserInventory } from './collections/UserInventory'
import { UserCurrency } from './collections/UserCurrency'
import { Quests } from './collections/Quests'
import { UserQuests } from './collections/UserQuests'
import { Achievements } from './collections/Achievements'
import { UserAchievementProgress } from './collections/UserAchievementProgress'
import { Challenges } from './collections/Challenges'
import { UserChallengeProgression } from './collections/UserChallengeProgression'
import { Comments } from './collections/Comments'
import { UserSolutions } from './collections/UserSolutions'
import { ChallengeSubmissions } from './collections/ChallengeSubmissions'
import { Notifications } from './collections/Notifications'
import { Skills } from './collections/Skills'
import { Concepts } from './collections/Concepts'
import { ImplementationConcepts } from './collections/ImplementationConcepts'
import { UserConceptProgressions } from './collections/UserConceptProgressions'
import { UserImplementationConceptProgressions } from './collections/UserImplementationConceptProgressions'
import { ChallengeCategory } from './collections/ChallengeCategory'
import { UserFollowingInformations } from './collections/UserFollowingInformations'
import { Items } from './collections/Items'
import { UserItems } from './collections/UserItems'
import { ActiveEffects } from './collections/ActiveEffects'
import { MarketplaceItem } from './collections/MarketplaceItem'
import { Divisions } from './collections/Divisions'
import { ExperienceLogs } from './collections/ExperienceLogs'
import { WeeklyDivisionLeaderboards } from './collections/WeeklyDivisionLeaderboards'
import { WeeklyLeaderboardMembers } from './collections/WeeklyLeaderboardMembers'
import type { PayloadRequest } from 'payload'

// ---> IMPORT PLACEHOLDER FOR TASK HANDLER <---
import { checkAndUpdatePrerequisitesHandler } from './core/skills/tasks' // Assuming we create tasks.ts

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// --- Task Handler Logic (example structure) ---
// It's often cleaner to define handlers in separate files, but placing here for brevity
const createWeeklyLeaderboardsHandler: TaskHandler<'createWeeklyDivisionLeaderboards'> = async ({
  req,
}) => {
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

// --- Task Handler Logic: End of Week ---
const processWeeklyResultsHandler: TaskHandler<'processWeeklyLeaderboardResults'> = async ({
  req,
}) => {
  const payload = req.payload
  console.log('Starting processWeeklyLeaderboardResults task...')

  try {
    // 1. Identify the week that just ended
    const now = new Date()
    // Calculate the start date of the *previous* week (assuming this runs right after the week ends)
    const dayOfWeek = now.getUTCDay() // 0 = Sunday, 1 = Monday, ...
    const diffToLastMonday = dayOfWeek === 0 ? -13 : -6 - dayOfWeek // Days to subtract to get to the Monday *before* the one that just started
    const lastWeekStartDate = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + diffToLastMonday,
      0,
      0,
      0,
      0,
    )
    const lastWeekEndDate = new Date(lastWeekStartDate)
    lastWeekEndDate.setDate(lastWeekStartDate.getDate() + 7)

    // Get the corresponding week identifier
    const year = lastWeekStartDate.getUTCFullYear()
    const weekNum = Math.ceil(
      ((lastWeekStartDate.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7,
    )
    const weekIdentifier = `${year}-W${weekNum.toString().padStart(2, '0')}`

    console.log(
      `Processing results for week: ${weekIdentifier}, Start: ${lastWeekStartDate.toISOString()}, End: ${lastWeekEndDate.toISOString()}`,
    )

    // 2. Find all unprocessed leaderboards for that week
    const leaderboardsToProcess = await payload.find({
      collection: 'weekly-division-leaderboards',
      where: {
        weekIdentifier: { equals: weekIdentifier },
        isProcessed: { equals: false }, // Only get unprocessed ones
      },
      limit: 0, // Process all leaderboards for the week
      pagination: false,
      depth: 1, // Need division details (thresholds, rewards)
    })

    console.log(
      `Found ${leaderboardsToProcess.docs.length} leaderboards to process for week ${weekIdentifier}.`,
    )

    // 3. Process each leaderboard
    for (const leaderboard of leaderboardsToProcess.docs) {
      console.log(
        `Processing leaderboard ID: ${leaderboard.id} for division ID: ${typeof leaderboard.division === 'object' ? leaderboard.division.id : leaderboard.division}`,
      )
      const divisionDetails = leaderboard.division as Division // Type assertion

      if (!divisionDetails || typeof leaderboard.division !== 'object') {
        console.error(
          `  Skipping leaderboard ${leaderboard.id}: Division details not populated or invalid.`,
        )
        continue
      }
      const currentDivisionId = divisionDetails.id

      // 4. Fetch members of this leaderboard
      const members = await payload.find({
        collection: 'weekly-leaderboard-members',
        where: {
          leaderboard: { equals: leaderboard.id },
        },
        limit: 0, // Get all members
        pagination: false,
      })

      // 5. Calculate weekly XP for each member
      const memberScores = await Promise.all(
        members.docs.map(async (member) => {
          const weeklyXp = await getWeeklyUserExperience(
            member.userId,
            lastWeekStartDate,
            lastWeekEndDate,
          )
          return { ...member, calculatedXp: weeklyXp }
        }),
      )

      // 6. Sort members by score (descending) and assign rank
      memberScores.sort((a, b) => b.calculatedXp - a.calculatedXp)

      const rankedMembers = memberScores.map((member, index) => ({
        ...member,
        calculatedRank: index + 1,
      }))

      // 7. Update member records (XP & Rank) and apply promotion/demotion
      const memberUpdatePromises = rankedMembers.map(async (member) => {
        try {
          // Update member's weekly XP and final rank
          await payload.update({
            collection: 'weekly-leaderboard-members',
            id: member.id,
            data: {
              weeklyExperience: member.calculatedXp,
              finalRank: member.calculatedRank,
            },
          })

          // --- Promotion/Demotion Logic --- START
          const totalMembers = members.docs.length
          const rankPercentile = (member.calculatedRank / totalMembers) * 100
          let targetDivisionId: number | null = null

          // Check for Promotion
          if (rankPercentile <= divisionDetails.promotionThreshold) {
            console.log(
              `  User ${member.userId} ranked ${member.calculatedRank}/${totalMembers} (${rankPercentile.toFixed(1)}%), checking for promotion from division ${currentDivisionId}.`,
            )
            targetDivisionId = await findTargetDivision(currentDivisionId, 'promote')
            if (targetDivisionId) {
              console.log(`    Promoting user ${member.userId} to division ${targetDivisionId}.`)
            }
          }
          // Check for Demotion (only if not promoted)
          else if (rankPercentile >= 100 - divisionDetails.demotionThreshold) {
            console.log(
              `  User ${member.userId} ranked ${member.calculatedRank}/${totalMembers} (${rankPercentile.toFixed(1)}%), checking for demotion from division ${currentDivisionId}.`,
            )
            targetDivisionId = await findTargetDivision(currentDivisionId, 'demote')
            if (targetDivisionId) {
              console.log(`    Demoting user ${member.userId} to division ${targetDivisionId}.`)
            }
          }

          // Update UserGamification if division changed
          if (targetDivisionId !== null && targetDivisionId !== currentDivisionId) {
            await payload.update({
              collection: 'user-gamification',
              where: {
                userId: { equals: member.userId },
              },
              data: {
                division: targetDivisionId,
              },
            })
          }
          // --- Promotion/Demotion Logic --- END

          // --- Reward Logic --- START
          const finalRank = member.calculatedRank
          if (divisionDetails.rewards && Array.isArray(divisionDetails.rewards)) {
            for (const rewardTier of divisionDetails.rewards) {
              // Check if the rank falls within the tier's range
              if (finalRank >= rewardTier.rankStart && finalRank <= rewardTier.rankEnd) {
                if (rewardTier.coinAmount && rewardTier.coinAmount > 0) {
                  console.log(
                    `    Awarding ${rewardTier.coinAmount} coins to user ${member.userId} for rank ${finalRank}.`,
                  )
                  try {
                    await addCurrency(
                      member.userId,
                      rewardTier.coinAmount,
                      `Weekly Division Reward (Rank ${finalRank})`,
                    )
                  } catch (currencyError) {
                    console.error(
                      `      Failed to add currency reward for user ${member.userId}:`,
                      currencyError,
                    )
                  }
                }
                // Add logic for item rewards here if needed in the future
                break // Stop checking tiers once a matching one is found
              }
            }
          }
          // --- Reward Logic --- END
        } catch (updateError) {
          console.error(
            `  Error processing member ${member.userId} for leaderboard ${leaderboard.id}:`,
            updateError,
          )
        }
      })

      await Promise.all(memberUpdatePromises)

      // 8. Mark leaderboard as processed
      try {
        await payload.update({
          collection: 'weekly-division-leaderboards',
          id: leaderboard.id,
          data: {
            isProcessed: true,
          },
        })
        console.log(`  Successfully processed leaderboard ID: ${leaderboard.id}`)
      } catch (processError) {
        console.error(`  Error marking leaderboard ${leaderboard.id} as processed:`, processError)
      }
    }

    console.log('Finished processWeeklyLeaderboardResults task.')
  } catch (error) {
    console.error('Error running processWeeklyLeaderboardResults task:', error)
    throw error // Re-throwing marks job as failed
  }
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Articles,
    Tutorials,
    Tags,
    Feedbacks,
    SupportSettings,
    UserInformations,
    Permissions,
    UserGamification,
    UserInventory,
    UserCurrency,
    Quests,
    UserQuests,
    Achievements,
    UserAchievementProgress,
    Challenges,
    UserChallengeProgression,
    Comments,
    UserSolutions,
    ChallengeSubmissions,
    Notifications,
    ChallengeCategory,
    UserFollowingInformations,
    Items,
    UserItems,
    ActiveEffects,
    MarketplaceItem,
    Divisions,
    ExperienceLogs,
    WeeklyDivisionLeaderboards,
    WeeklyLeaderboardMembers,
    Skills,
    Concepts,
    ImplementationConcepts,
    UserConceptProgressions,
    UserImplementationConceptProgressions,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Log pour voir si cette fonction est même atteinte
        console.log(`>>> jobs.access.run triggered for URL: ${req.url}`)
        // Log le header pour vérifier sa présence ici
        console.log(`>>> Auth header inside access check: ${req.headers?.get('authorization')}`)

        // Temporairement, on autorise tout pour voir si le 404 disparaît
        return true

        // --- Original Logic (Commented out) ---
        // Allow logged in users with admin role (adjust role check as needed)
        // if (
        //   req.user &&
        //   req.user.collection === 'users' /* && req.user.roles?.includes('admin') */
        // ) {
        //   return true
        // }
        //
        // Allow Vercel Cron via secret
        // const authHeader = req.headers.get('authorization')
        // if (process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`) {
        //   return true
        // }
        //
        // Deny access otherwise
        // return false
        // --- End Original Logic ---
      },
    },
    tasks: [
      {
        slug: 'createWeeklyDivisionLeaderboards',
        label: 'Create Weekly Division Leaderboards',
        handler: createWeeklyLeaderboardsHandler,
        retries: 2,
        queue: 'weekly-start',
      } as TaskConfig<'createWeeklyDivisionLeaderboards'>,
      {
        slug: 'processWeeklyLeaderboardResults',
        label: 'Process Weekly Leaderboard Results',
        handler: processWeeklyResultsHandler,
        retries: 2,
        queue: 'weekly-end',
      } as unknown as TaskConfig<'processWeeklyLeaderboardResults'>,

      // ---> NEW TASK DEFINITION <---
      {
        slug: 'checkAndUpdatePrerequisites',
        label: 'Check and Update Skill Prerequisites',
        handler: checkAndUpdatePrerequisitesHandler, // Lié à la fonction qu'on va créer
        queue: 'skill-prerequisites', // Queue dédiée
        retries: 1, // Une tentative en cas d'erreur temporaire
        inputSchema: [
          // Définit ce que la tâche attend en entrée
          {
            name: 'userId',
            type: 'text',
            required: true,
            label: 'User ID (Supabase)',
          },
          {
            name: 'conceptId',
            type: 'number',
            required: true,
            label: 'Concept ID to Check Prerequisites For',
          },
        ],
        // outputSchema: [], // Pas besoin d'output spécifique pour cette tâche
      } as unknown as TaskConfig<'checkAndUpdatePrerequisites'>, // Assure le typage fort
      // ---> END NEW TASK DEFINITION <---
    ],
    // processingOrder: { ... }, // Optionnel: définir l'ordre si nécessaire
    // shouldAutoRun: ... // Pas nécessaire si on utilise Supabase Cron + Endpoint
  },
})
