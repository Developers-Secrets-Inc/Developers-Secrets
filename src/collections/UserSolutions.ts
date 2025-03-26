import type { CollectionConfig } from 'payload'

export const UserSolutions: CollectionConfig = {
  slug: 'user-solutions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'authorId', 'views'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the solution',
      },
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      admin: {
        description: 'A brief description of the solution',
      },
    },
    {
      name: 'challenge',
      type: 'relationship',
      relationTo: 'challenges',
      required: true,
      admin: {
        description: 'The challenge this solution is for',
      },
    },
    {
      name: 'authorId',
      type: 'text',
      required: true,
      admin: {
        description: 'The ID of the user who created the solution',
      },
    },
    {
      name: 'votes',
      type: 'array',
      fields: [
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Upvote', value: 'upvote' },
            { label: 'Downvote', value: 'downvote' },
          ],
          required: true,
          admin: {
            description: 'The type of vote',
          },
        },
        {
          name: 'authorId',
          type: 'text',
          required: true,
          admin: {
            description: 'The ID of the user who voted',
          },
        },
      ],
      admin: {
        description: 'The votes for this solution',
      },
    },
    {
      name: 'views',
      type: 'number',
      required: false,
      defaultValue: 0,
      admin: {
        description: 'Number of times this solution has been viewed',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        description: 'Tags associated with this solution',
      },
    },
    {
      name: 'content',
      type: 'text',
      required: true,
      admin: {
        description: 'The main content of the solution',
      },
    },
    {
      name: 'comments',
      type: 'relationship',
      relationTo: 'comments',
      hasMany: true,
      admin: {
        description: 'Comments on this solution',
      },
    },
  ],
}
