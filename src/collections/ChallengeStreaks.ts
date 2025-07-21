import type { CollectionConfig } from 'payload'

export const ChallengeStreaks: CollectionConfig = {
  slug: 'challenge-streaks',
  admin: {
    useAsTitle: 'userId',
    defaultColumns: ['userId', 'date', 'challengesCompleted', 'status'],
  },
  timestamps: false,
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
      label: 'Date',
      type: 'date',
      required: true,
      admin: {
        description: 'The date of the challenge completion streak.',
      },
    },
    {
      name: 'challengesCompleted',
      label: 'Challenges Completed',
      type: 'number',
      required: true,
      defaultValue: 1,
      admin: {
        description: 'The number of challenges completed on this date.',
      },
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: ['active', 'frozen'],
      defaultValue: 'active',
      required: true,
      admin: {
        description: 'The status of the streak for this day.',
      },
    },
  ],
}
