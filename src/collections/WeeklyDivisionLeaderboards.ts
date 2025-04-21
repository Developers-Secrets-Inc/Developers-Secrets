import type { CollectionConfig } from 'payload'

export const WeeklyDivisionLeaderboards: CollectionConfig = {
  slug: 'weekly-division-leaderboards',
  admin: {
    useAsTitle: 'weekIdentifier',
    defaultColumns: ['weekIdentifier', 'division', 'startDate', 'endDate'],
    description: 'Represents a specific leaderboard group within a division for a given week.',
    // Consider hiding or making read-only in admin UI as they are system-generated
    // hidden: true,
  },
  fields: [
    {
      name: 'weekIdentifier',
      label: 'Week Identifier',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Unique identifier for the week, e.g., YYYY-W## (2024-W30).',
      },
    },
    {
      name: 'division',
      type: 'relationship',
      relationTo: 'divisions',
      required: true,
      index: true,
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'isProcessed', // Flag to indicate if week-end job has run
      label: 'Is Processed',
      type: 'checkbox',
      defaultValue: false,
      index: true,
    },
  ],
}
