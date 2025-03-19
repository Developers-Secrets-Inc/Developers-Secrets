// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

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
import { Achievements } from './collections/Achievements'
import { UserAchievements } from './collections/UserAchievements'
import { Challenges } from './collections/Challenges'

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
    Achievements,
    UserAchievements,
    Challenges,
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
})
