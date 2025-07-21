import type { CollectionConfig } from 'payload'

export const UserItems: CollectionConfig = {
  slug: 'user-items',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['userId', 'item', 'quantity', 'updatedAt'],
  },
  fields: [
    {
      name: 'userId',
      label: 'User ID',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'The ID of the user who owns this item',
      },
    },
    {
      name: 'item',
      label: 'Item',
      type: 'relationship',
      relationTo: 'items',
      required: true,
      admin: {
        description: 'The item owned by the user',
      },
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 1,
      admin: {
        description: 'The number of this item owned by the user',
      },
    },
  ],
  timestamps: true, // Adds createdAt and updatedAt automatically
  indexes: [
    {
      fields: ['userId', 'item'],
      unique: true,
    },
  ],
}
