import type { CollectionConfig } from 'payload'

export const UserAICredits: CollectionConfig = {
  slug: 'user-ai-credits',
  admin: {
    useAsTitle: 'userId',
    defaultColumns: ['userId', 'balance', 'updatedAt'],
  },
  labels: {
    singular: 'User AI Credit',
    plural: 'User AI Credits',
  },
  fields: [
    {
      name: 'userId',
      label: 'User ID',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'balance',
      label: 'Balance',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
    },
  ],
}
