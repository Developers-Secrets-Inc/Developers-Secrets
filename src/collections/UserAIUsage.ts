import type { CollectionConfig } from 'payload'

export const UserAIUsage: CollectionConfig = {
  slug: 'user-ai-usage',
  admin: {
    useAsTitle: 'userId',
    defaultColumns: ['userId', 'date', 'messagesUsed', 'dailyLimit'],
  },
  labels: {
    singular: 'User AI Usage',
    plural: 'User AI Usages',
  },
  fields: [
    {
      name: 'userId',
      label: 'User ID',
      type: 'text',
      required: true,
      unique: false,
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'messagesUsed',
      label: 'Messages Used',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'dailyLimit',
      label: 'Daily Limit',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
    },
  ],
}
