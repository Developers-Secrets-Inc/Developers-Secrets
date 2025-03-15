import type { CollectionConfig } from 'payload'

export const UserCurrency: CollectionConfig = {
  slug: 'user-currency',
  admin: {
    useAsTitle: 'userId',
    defaultColumns: ['userId', 'coins', 'lastUpdated'],
  },
  labels: {
    singular: 'User Currency',
    plural: 'User Currencies',
  },
  fields: [
    {
      name: 'userId',
      label: 'User ID',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'The ID of the user this currency belongs to',
      },
    },
    {
      name: 'coins',
      label: 'Coins',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Standard currency earned through regular activities',
      },
    },
    {
      name: 'transactionHistory',
      label: 'Transaction History',
      type: 'array',
      admin: {
        description: 'History of currency transactions',
      },
      fields: [
        {
          name: 'timestamp',
          label: 'Timestamp',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            description: 'When the transaction occurred',
          },
        },
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          required: true,
          options: [
            { label: 'Earn', value: 'earn' },
            { label: 'Spend', value: 'spend' },
            { label: 'Admin Adjustment', value: 'admin_adjustment' },
          ],
          admin: {
            description: 'The type of transaction',
          },
        },
        {
          name: 'amount',
          label: 'Amount',
          type: 'number',
          required: true,
          admin: {
            description: 'The amount of coins (positive for earning, negative for spending)',
          },
        },
        {
          name: 'source',
          label: 'Source',
          type: 'text',
          admin: {
            description:
              'The source or reason for the transaction (e.g., "daily_challenge", "level_up", "achievement")',
          },
        },
        {
          name: 'details',
          label: 'Details',
          type: 'text',
          admin: {
            description: 'Additional details about the transaction',
          },
        },
      ],
    },
    {
      name: 'lastUpdated',
      label: 'Last Updated',
      type: 'date',
      admin: {
        description: 'When this currency record was last updated',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Mettre à jour la date de dernière modification
        data.lastUpdated = new Date().toISOString()
        return data
      },
    ],
  },
}
