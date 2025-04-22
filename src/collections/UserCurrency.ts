import type { CollectionConfig } from 'payload'

export const UserCurrency: CollectionConfig = {
  slug: 'user-currency',
  admin: {
    useAsTitle: 'userId',
    defaultColumns: ['userId', 'quantity', 'updatedAt'],
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
        description: 'The ID of the user who owns this currency',
      },
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'The amount of currency owned by the user',
      },
    },
    {
      name: 'transactionHistory',
      type: 'array',
      admin: {
        description: 'History of currency transactions',
      },
      fields: [
        {
          name: 'timestamp',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Earn', value: 'earn' },
            { label: 'Spend', value: 'spend' },
            { label: 'System', value: 'system' },
          ],
        },
        {
          name: 'amount',
          type: 'number',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  timestamps: true, // Adds createdAt and updatedAt automatically
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Ensure quantity is never negative
        if (data.quantity < 0) {
          data.quantity = 0
        }
        return data
      },
    ],
  },
}
