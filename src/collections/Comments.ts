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
      name: 'votes',
      type: 'array',
      fields: [
        {
          name: 'userId',
          type: 'text',
          required: true,
          admin: {
            description: 'The ID of the user who voted',
          },
        },
        {
          name: 'vote',
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
      ],
      admin: {
        description: 'The votes for this comment',
      },
    },
    {
      name: 'isReply',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this comment is a reply',
      },
    },
    {
      name: 'replies',
      type: 'relationship',
      relationTo: 'comments',
      hasMany: true,
      admin: {
        description: 'Replies to this comment',
        condition: (data) => !data.isReply,
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
  ],
}
