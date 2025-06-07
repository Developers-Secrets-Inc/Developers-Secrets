import { CollectionConfig } from 'payload'

export const UserChallengeProgression: CollectionConfig = {
  slug: 'userChallengeProgression',
  admin: {
    useAsTitle: 'userId',
    defaultColumns: [
      'userId',
      'challenge',
      'hasLiked',
      'hasDisliked',
      'completionStatus',
      'createdAt',
    ],
  },
  fields: [
    {
      name: 'userId',
      type: 'text',
      required: true,
      admin: {
        description: 'ID of the user',
      },
    },
    {
      name: 'challenge',
      type: 'relationship',
      relationTo: 'challenges',
      required: true,
      admin: {
        description: 'Related challenge',
      },
    },
    {
      name: 'hasLiked',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the user has liked this challenge',
      },
    },
    {
      name: 'hasDisliked',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the user has disliked this challenge',
      },
    },
    {
      name: 'userCode',
      type: 'text',
      admin: {
        description: 'The user\'s code for this challenge',
      },
    },
    {
      name: 'lastSavedAt',
      type: 'date',
      admin: {
        description: 'Timestamp of the last code save',
      },
      // You might want to automatically set this on update
      hooks: {
        beforeChange: [({ data }) => { if (data) { data.lastSavedAt = new Date(); } return data; }],
      },
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      required: false,
      admin: {
        description: 'User rating for this challenge (1-5)',
      },
    },
    {
      name: 'completionStatus',
      type: 'select',
      required: true,
      defaultValue: 'not_started',
      options: [
        {
          label: 'Not Started',
          value: 'not_started',
        },
        {
          label: 'In Progress',
          value: 'in_progress',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
      ],
      admin: {
        description: 'Current completion status of the challenge',
      },
    },
    {
      name: 'isSolutionUnlocked',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the solution has been unlocked by the user',
      },
    },
    {
      name: 'code',
      type: 'array',
      admin: {
        description: 'Code submissions for this challenge',
      },
      fields: [
        {
          name: 'language',
          type: 'text',
          required: true,
          admin: {
            description: 'Programming language of the code',
          },
        },
        {
          name: 'content',
          type: 'code',
          required: true,
          admin: {
            description: 'The actual code content',
          },
        },
      ],
    },
  ],
}
