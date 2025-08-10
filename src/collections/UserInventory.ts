import type { CollectionConfig } from 'payload'

enum ItemType {
  EXPERIENCE_BOOST = 'experience_boost',
  STREAK_SAVER = 'streak_saver',
  STREAK_RECOVERY = 'streak_recovery',
  SOLUTION_VIEWER = 'solution_viewer',
  CHEST = 'chest',
}

export const UserInventory: CollectionConfig = {
  slug: 'user-inventory',
  admin: {
    useAsTitle: 'userId',
    defaultColumns: ['userId', 'itemCount', 'lastUpdated'],
  },
  labels: {
    singular: 'User Inventory',
    plural: 'User Inventories',
  },
  fields: [
    {
      name: 'userId',
      label: 'User ID',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'The ID of the user this inventory belongs to',
      },
    },
    {
      name: 'items',
      label: 'Items',
      type: 'group',
      admin: {
        description: "Items in the user's inventory",
      },
      fields: [
        {
          name: 'itemEntries',
          label: 'Item Entries',
          type: 'array',
          admin: {
            description: 'List of items in the inventory',
          },
          fields: [
            {
              name: 'itemType',
              label: 'Item Type',
              type: 'select',
              required: true,
              options: [
                { label: 'Experience Boost', value: ItemType.EXPERIENCE_BOOST },
                { label: 'Streak Saver', value: ItemType.STREAK_SAVER },
                { label: 'Streak Recovery', value: ItemType.STREAK_RECOVERY },
                { label: 'Solution Viewer', value: ItemType.SOLUTION_VIEWER },
                { label: 'Chest', value: ItemType.CHEST },
              ],
              admin: {
                description: 'The type of the item',
              },
            },
            {
              name: 'itemVariant',
              label: 'Item Variant',
              type: 'select',
              required: true,
              options: [
                { label: 'Basic', value: 'basic' },
                { label: 'Premium', value: 'premium' },
                { label: 'Legendary', value: 'legendary' },
              ],
              admin: {
                description:
                  'The specific variant of the item (e.g., "basic", "premium", "legendary")',
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
                description: 'The quantity of this item',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'itemCount',
      label: 'Item Count',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total number of items in the inventory',
        readOnly: true,
      },
    },
    {
      name: 'lastUpdated',
      label: 'Last Updated',
      type: 'date',
      admin: {
        description: 'When this inventory was last updated',
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

        // Calculer le nombre total d'items
        if (data.items && data.items.itemEntries) {
          data.itemCount = data.items.itemEntries.reduce(
            (total: number, entry: { quantity?: number }) => total + (entry.quantity || 0),
            0,
          )
        } else {
          data.itemCount = 0
        }

        return data
      },
    ],
  },
}
