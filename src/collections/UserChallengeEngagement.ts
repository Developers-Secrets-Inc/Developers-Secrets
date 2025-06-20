import { CollectionConfig } from 'payload'

export const UserChallengeEngagement: CollectionConfig = {
  slug: 'userChallengeEngagement',
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
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      required: false,
      admin: {
        description: 'User rating for this challenge (1-5)',
      },
    },
  ],
}
