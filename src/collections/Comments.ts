import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'content',
  },
  fields: [
    {
      name: 'content',
      type: 'text',
      required: true,
      minLength: 1,
      maxLength: 1000,
      admin: {
        description: 'The content of the comment',
      },
    },
    {
      name: 'authorId',
      type: 'text',
      required: true,
      admin: {
        description: 'The ID of the user who created the comment',
      },
    },
    {
      name: 'challenge',
      type: 'relationship',
      relationTo: 'challenges',
      required: true,
      admin: {
        description: 'The challenge this comment belongs to',
      },
    },
    {
      name: 'targetType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Challenge Description',
          value: 'description',
        },
        {
          label: 'Official Solution',
          value: 'officialSolution',
        },
        {
          label: 'User Solution',
          value: 'userSolution',
        },
      ],
      admin: {
        description: 'The type of content this comment is associated with',
      },
    },
    {
      name: 'parentId',
      type: 'text',
      required: false,
      admin: {
        description: 'The ID of the parent comment if this is a reply',
      },
    },
    {
      name: 'votes',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'The number of upvotes minus downvotes',
      },
    },
    {
      name: 'reports',
      type: 'array',
      admin: {
        description: 'Reports made against this comment',
      },
      fields: [
        {
          name: 'userId',
          type: 'text',
          required: true,
        },
        {
          name: 'reason',
          type: 'text',
          required: true,
        },
        {
          name: 'details',
          type: 'text',
          required: false,
        },
        {
          name: 'createdAt',
          type: 'date',
          required: true,
        },
      ],
    },
    {
      name: 'createdAt',
      type: 'date',
      required: true,
      admin: {
        description: 'When the comment was created',
      },
    },
    {
      name: 'updatedAt',
      type: 'date',
      required: true,
      admin: {
        description: 'When the comment was last updated',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Set createdAt and updatedAt on creation
        if (!data.createdAt) {
          data.createdAt = new Date()
        }
        data.updatedAt = new Date()
        return data
      },
    ],
  },
}
