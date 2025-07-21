import type { CollectionConfig } from 'payload'

export const MarketplaceItem: CollectionConfig = {
  slug: 'marketplace-items',
  admin: {
    useAsTitle: 'item',
    defaultColumns: ['item', 'price', 'isAvailable', 'updatedAt'],
  },
  fields: [
    {
      name: 'item',
      label: 'Item',
      type: 'relationship',
      relationTo: 'items',
      required: true,
      unique: true,
      admin: {
        description: 'The item being sold in the marketplace',
      },
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'The price of the item in currency',
      },
    },
    {
      name: 'isAvailable',
      label: 'Is Available',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this item is currently available for purchase',
      },
    },
    {
      name: 'purchaseLimit',
      label: 'Purchase Limit',
      type: 'number',
      min: 0,
      admin: {
        description: 'Maximum number of times this item can be purchased (0 for unlimited)',
      },
    },
    {
      name: 'purchaseCount',
      label: 'Purchase Count',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Number of times this item has been purchased',
        readOnly: true,
      },
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      admin: {
        description: 'When this item becomes available for purchase',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      admin: {
        description: 'When this item will no longer be available for purchase',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'discount',
      label: 'Discount',
      type: 'group',
      admin: {
        description: 'Optional discount information',
      },
      fields: [
        {
          name: 'percentage',
          label: 'Discount Percentage',
          type: 'number',
          min: 0,
          max: 100,
          admin: {
            description: 'Percentage discount (0-100)',
          },
        },
        {
          name: 'startDate',
          label: 'Discount Start Date',
          type: 'date',
          admin: {
            description: 'When the discount becomes active',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'endDate',
          label: 'Discount End Date',
          type: 'date',
          admin: {
            description: 'When the discount expires',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
  ],
  timestamps: true, // Adds createdAt and updatedAt automatically
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Ensure price is never negative
        if (data.price < 0) {
          data.price = 0
        }

        // Apply discount if active
        if (data.discount?.percentage && data.discount?.startDate && data.discount?.endDate) {
          const now = new Date()
          const discountStart = new Date(data.discount.startDate)
          const discountEnd = new Date(data.discount.endDate)

          if (now >= discountStart && now <= discountEnd) {
            data.price = data.price * (1 - data.discount.percentage / 100)
          }
        }

        return data
      },
    ],
  },
}
