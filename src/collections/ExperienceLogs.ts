import type { CollectionConfig } from 'payload'

export const ExperienceLogs: CollectionConfig = {
  slug: 'experience-logs',
  admin: {
    useAsTitle: 'id', // Or customize based on fields
    defaultColumns: ['userId', 'amount', 'timestamp', 'source'],
    description: 'Records every instance of experience points gained by users.',
    // Hidden from admin UI by default, as it's primarily for logging
    hidden: true,
  },
  fields: [
    {
      name: 'userId',
      label: 'User ID',
      type: 'text',
      required: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'amount',
      label: 'XP Amount',
      type: 'number',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'timestamp',
      label: 'Timestamp',
      type: 'date',
      required: true,
      index: true,
      defaultValue: () => new Date(),
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
      },
    },
    {
      name: 'source',
      label: 'Source',
      type: 'text',
      admin: {
        description: 'Optional: Where the experience came from (e.g., challenge, quest).',
        readOnly: true,
      },
    },
  ],
}
