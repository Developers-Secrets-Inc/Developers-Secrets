import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'content',
  },
  fields: [
    {
      name: 'challenge',
      label: 'Challenge',
      type: 'relationship',
      relationTo: 'challenges',
      required: true,
      unique: true,
      admin: {
        description: 'The challenge for which engagement stats are tracked',
      },
      maxDepth: 0,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'group',
      admin: {
        description: 'Challenge description and problem statement',
      },
      fields: [
        {
          name: 'comments',
          label: 'Comments',
          type: 'relationship',
          relationTo: 'comments',
          hasMany: true,
          admin: {
            description: 'Comments on this challenge description',
          },
        },
      ],
    },
    {
      name: 'officialSolution',
      label: 'Official Solution',
      type: 'group',
      admin: {
        description: 'The official solution for this challenge',
      },
      fields: [
        {
          name: 'comments',
          label: 'Comments',
          type: 'relationship',
          relationTo: 'comments',
          hasMany: true,
          admin: {
            description: 'Comments on this official solution',
          },
        },
      ],
    },
  ],
}
