import type { CollectionConfig } from 'payload'

export const ChallengeCategory: CollectionConfig = {
  slug: 'challenge-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'description', 'isLocked', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      admin: {
        description: 'The name of the challenge category',
      },
    },
    {
      name: 'summary',
      label: 'Summary',
      type: 'textarea',
      required: false,
      admin: {
        description: 'A brief summary of the category that appears at the top of the page',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'A detailed description of what this category covers',
      },
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      admin: {
        description: 'URL-friendly identifier for this category',
      },
    },
    {
      name: 'isLocked',
      label: 'Is Locked',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this category is locked and unavailable to users',
        position: 'sidebar',
      },
    },
    {
      name: 'parts',
      label: 'Category Parts',
      type: 'array',
      admin: {
        description: 'Different parts/sections within this category',
      },
      fields: [
        {
          name: 'name',
          label: 'Part Name',
          type: 'text',
          required: true,
          admin: {
            description: 'Name of this part/section',
          },
        },
        {
          name: 'description',
          label: 'Part Description',
          type: 'textarea',
          admin: {
            description: 'Description of what this part covers',
          },
        },
        {
          name: 'challenges',
          label: 'Challenges',
          type: 'relationship',
          relationTo: 'challenges',
          hasMany: true,
          required: true,
          admin: {
            description: 'Sequence of challenges in this part',
          },
        },
      ],
    },
  ],
  timestamps: true,
}
