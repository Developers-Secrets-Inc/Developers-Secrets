import type { CollectionConfig } from 'payload'

export const DailyLoginEntry: CollectionConfig = {
  slug: 'daily-login-entries',
  admin: {
    useAsTitle: 'userId',
    defaultColumns: ['userId', 'date'],
  },
  timestamps: false, // Désactive les champs createdAt et updatedAt pour cette collection
  fields: [
    {
      name: 'userId',
      label: 'User ID',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'The Supabase user ID',
      },
    },
    {
      name: 'date',
      label: 'Login Date',
      type: 'date',
      required: true,
      admin: {
        description: 'The date when the user logged in',
      },
    },
  ],
}
