import type { CollectionConfig } from 'payload'

export const ChallengeTag: CollectionConfig = {
  slug: 'challenge-tags',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'concept', 'challengeCount', 'isActive', 'updatedAt'],
    description: 'Associates a unique concept with a set of challenges, creating conceptual tags for challenge organization.',
  },
  fields: [
    {
      name: 'name',
      label: 'Tag Name',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name for this challenge tag (e.g., "Loops Challenges", "OOP Fundamentals")',
      },
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly identifier for this tag. Will be used in the URL.',
      },
    },
    {
      name: 'concept',
      label: 'Associated Concept',
      type: 'relationship',
      relationTo: 'concepts',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'The unique concept that this tag represents. Each concept can only have one tag.',
        position: 'sidebar',
      },
    },
    {
      name: 'challenges',
      label: 'Tagged Challenges',
      type: 'relationship',
      relationTo: 'challenges',
      hasMany: true,
      admin: {
        description: 'Challenges that belong to this conceptual tag.',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      admin: {
        description: 'Optional description explaining what challenges in this tag focus on.',
      },
    },
    {
      name: 'isActive',
      label: 'Active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this tag is currently active and visible to users.',
        position: 'sidebar',
      },
    },
    {
      name: 'challengeCount',
      label: 'Challenge Count',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of challenges in this tag (updated automatically).',
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            // Calculate challenge count automatically
            if (data?.challenges && Array.isArray(data.challenges)) {
              return data.challenges.length
            }
            return 0
          },
        ],
      },
    },
    {
      name: 'displayOrder',
      label: 'Display Order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order for displaying tags (lower numbers appear first).',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
  indexes: [
    {
      fields: ['concept'],
      unique: true,
    },
    {
      fields: ['slug'],
      unique: true,
    },
    {
      fields: ['isActive', 'displayOrder'],
    },
  ],
}