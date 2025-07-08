import { CollectionConfig } from 'payload'

export const UserChallengeCode: CollectionConfig = {
  slug: 'userChallengeCode',
  admin: {
    useAsTitle: 'userId',
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