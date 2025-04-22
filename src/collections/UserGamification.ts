import type { CollectionConfig } from 'payload'

// Assume the default division (e.g., Bronze) has ID 1
const DEFAULT_DIVISION_ID = 1

export const UserGamification: CollectionConfig = {
  slug: 'user-gamification',
  admin: {
    useAsTitle: 'userId',
    defaultColumns: ['userId', 'currentLevel', 'currentExperience', 'division', 'updatedAt'],
    description: 'Tracks user level, experience, and division.',
  },
  labels: {
    singular: 'User Gamification',
    plural: 'User Gamifications',
  },
  fields: [
    {
      name: 'userId',
      label: 'User ID',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'currentLevel',
      label: 'Current Level',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 1,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'currentExperience',
      label: 'Current Experience',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalExperience',
      label: 'Total Experience',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'lastLevelUpDate',
      label: 'Last Level Up Date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'division',
      label: 'Current Division',
      type: 'relationship',
      relationTo: 'divisions',
      hasMany: false,
      index: true,
      admin: {},
    },
    {
      name: 'dailyQuestReplacementsUsed',
      label: 'Daily Quest Replacements Used',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Number of times the user has replaced a daily quest today.',
      },
    },
    {
      name: 'lastQuestReplacementDate',
      label: 'Last Quest Replacement Date',
      type: 'date',
      admin: {
        description: 'The date the user last replaced a quest.',
        date: {
          pickerAppearance: 'dayOnly', // Keep it simple, time is not needed
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          if (!data.lastLevelUpDate) {
            data.lastLevelUpDate = new Date()
          }
          if (!data.division) {
            data.division = DEFAULT_DIVISION_ID
          }
        }

        return data
      },
    ],
  },
}
