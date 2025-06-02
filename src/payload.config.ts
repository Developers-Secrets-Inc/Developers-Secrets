import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import type { PayloadRequest, TaskConfig, TaskHandler } from 'payload'
import { Achievements } from './collections/Achievements'
import { ActiveEffects } from './collections/ActiveEffects'
import { Articles } from './collections/Articles'
import { ChallengeCategory } from './collections/ChallengeCategory'
import { Challenges } from './collections/Challenges'
import { ChallengeSubmissions } from './collections/ChallengeSubmissions'
import { Comments } from './collections/Comments'
import { Concepts } from './collections/Concepts'
import { Divisions } from './collections/Divisions'
import { ExperienceLogs } from './collections/ExperienceLogs'
import { Feedbacks } from './collections/Feedbacks'
import { ImplementationConcepts } from './collections/ImplementationConcepts'
import { Items } from './collections/Items'
import { MarketplaceItem } from './collections/MarketplaceItem'
import { Media } from './collections/Media'
import { Notifications } from './collections/Notifications'
import { Permissions } from './collections/Permissions'
import { Quests } from './collections/Quests'
import { Skills } from './collections/Skills'
import { SupportSettings } from './collections/SupportSettings'
import { Tags } from './collections/Tags'
import { Tutorials } from './collections/Tutorials'
import { UserAchievementProgress } from './collections/UserAchievementProgress'
import { UserChallengeProgression } from './collections/UserChallengeProgression'
import { UserConceptProgressions } from './collections/UserConceptProgressions'
import { UserCurrency } from './collections/UserCurrency'
import { UserFollowingInformations } from './collections/UserFollowingInformations'
import { UserGamification } from './collections/UserGamification'
import { UserImplementationConceptProgressions } from './collections/UserImplementationConceptProgressions'
import { UserInformations } from './collections/UserInformations'
import { UserInventory } from './collections/UserInventory'
import { UserItems } from './collections/UserItems'
import { UserQuests } from './collections/UserQuests'
import { Users } from './collections/Users'
import { UserSolutions } from './collections/UserSolutions'
import { WeeklyDivisionLeaderboards } from './collections/WeeklyDivisionLeaderboards'
import { WeeklyLeaderboardMembers } from './collections/WeeklyLeaderboardMembers'
import { ConceptGroups } from './collections/ConceptGroups'
import { Courses } from './collections/Courses'
import { Chapters } from './collections/Chapters'
import { CourseParts } from './collections/CourseParts'
import { CoursePartUserProgression } from './collections/CoursePartUserProgression'
import { CoursePartSubmissions } from './collections/CoursePartSubmissions'
import { UserChapterProgress } from './collections/UserChapterProgress'
import { CoursePartFeedback } from './collections/CoursePartFeedback'
import UserOnboarding from './collections/UserOnboarding'
import { LearningPath } from './collections/LearningPath'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
    ConceptGroups,
    Courses,
    LearningPath,
    Chapters,
    CourseParts,
    CoursePartUserProgression,
    CoursePartSubmissions,
    UserChapterProgress,
    CoursePartFeedback,
    UserOnboarding,
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
        // Allow logged in users with admin role (adjust role check as needed)
        if (req.user && (req.user as any).role === 'admin') {
          return true
        }

        // Allow Vercel Cron via secret
        const authHeader = req.headers.get('authorization')
        if (process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`) {
          return true
        }

        // Deny access otherwise
        return false
      },
    },
    tasks: [
      {
        slug: 'createWeeklyDivisionLeaderboards',
        handler: async (...args) => {
          const { createWeeklyLeaderboardsHandler } = await import(
            './jobs/createWeeklyLeaderboards'
          )
          return createWeeklyLeaderboardsHandler(...args)
        },
        // Add other config like retries, queue if needed
        // queue: 'weekly-start',
        // retries: 2,
      },
      {
        slug: 'processWeeklyLeaderboardResults',
        handler: async (...args) => {
          const { processWeeklyResultsHandler } = await import('./jobs/processWeeklyResults')
          return processWeeklyResultsHandler(...args)
        },
        // queue: 'weekly-end',
        // retries: 2,
      },
    ],
  },
})
