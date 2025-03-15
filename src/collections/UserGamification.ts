import type { CollectionConfig } from 'payload'

export const UserGamification: CollectionConfig = {
  slug: 'user-gamification',
  admin: {
    useAsTitle: 'userId',
    defaultColumns: ['userId', 'currentLevel', 'currentExperience', 'totalExperience'],
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
      index: true,
      admin: {
        description: 'The ID of the user this gamification data belongs to',
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
        description: 'The current level of the user',
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
        description: 'The current experience points towards the next level',
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
        description: 'The total experience points earned by the user',
      },
    },
    {
      name: 'lastLevelUpDate',
      label: 'Last Level Up Date',
      type: 'date',
      admin: {
        description: 'The date when the user last leveled up',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Si c'est une nouvelle entrée, initialiser la date de dernier level up
        if (!data.lastLevelUpDate) {
          data.lastLevelUpDate = new Date()
        }
        return data
      },
    ],
  },
}
