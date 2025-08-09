import type { CollectionConfig } from 'payload'

export const UserPageVisits: CollectionConfig = {
  slug: 'user-page-visits',
  admin: {
    useAsTitle: 'path',
    defaultColumns: ['userId', 'path', 'visited', 'updatedAt'],
    description: 'Tracks whether a user has visited a specific app route (boolean only).',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'userId',
      label: 'User ID',
      type: 'text',
      required: true,
      index: true,
      maxLength: 255,
      admin: {
        description: 'The Supabase user ID (UUID).',
      },
    },
    {
      name: 'path',
      label: 'Path',
      type: 'text',
      required: true,
      index: true,
      maxLength: 255,
      admin: {
        description:
          'The application route path (e.g., /(frontend)/(dashboard)/(navigation)/home).',
      },
    },
    {
      name: 'visited',
      label: 'Visited',
      type: 'checkbox',
      required: true,
      defaultValue: true,
      admin: {
        description: 'Whether the user has visited the specified path.',
        position: 'sidebar',
      },
    },
  ],
  indexes: [
    {
      fields: ['userId', 'path'],
      unique: true,
    },
  ],
  timestamps: true,
}
