import type { CollectionConfig } from 'payload'

export const UserAchievementProgress: CollectionConfig = {
  slug: 'user-achievement-progress',
  admin: {
    useAsTitle: 'achievement', // Or combine user/achievement if possible
    defaultColumns: ['user', 'achievement', 'currentProgress', 'currentTierIndex', 'updatedAt'],
    description: 'Tracks user progress towards specific achievements.',
  },
  labels: {
    singular: 'User Achievement Progress',
    plural: 'User Achievement Progress Records',
  },
  fields: [
    {
      name: 'userId',
      label: 'User ID',
      type: 'text', // Using text as per user request for Supabase UUID
      required: true,
      index: true,
      admin: {
        description: 'The Supabase UUID of the user.',
        readOnly: true, // Progress should be updated programmatically
      },
    },
    {
      name: 'achievement',
      label: 'Achievement',
      type: 'relationship',
      relationTo: 'achievements',
      required: true,
      index: true,
      admin: {
        readOnly: true, // Progress should be updated programmatically
      },
    },
    {
      name: 'currentProgress',
      label: 'Current Progress',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'The current progress value towards the next tier threshold.',
        readOnly: true,
      },
    },
    {
      name: 'currentTierIndex',
      label: 'Current Tier Index',
      type: 'number',
      required: true,
      defaultValue: -1, // -1 indicates no tier achieved yet
      min: -1,
      admin: {
        description:
          "The index of the highest achieved tier in the Achievement's tiers array (-1 if none).",
        readOnly: true,
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      label: 'Created At',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'updatedAt',
      type: 'date',
      label: 'Updated At',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        const now = new Date().toISOString()
        // Set createdAt only during create operation
        if (operation === 'create' && !data.createdAt) {
          data.createdAt = now
        }
        // Always set updatedAt
        data.updatedAt = now
        return data
      },
    ],
  },
  // Access control: Ensure only server-side logic can modify progress
  access: {
    read: () => true, // Allow reading progress (e.g., for UI)
    create: () => false, // Prevent client-side creation
    update: () => false, // Prevent client-side updates
    delete: () => false, // Prevent client-side deletion
  },
}
