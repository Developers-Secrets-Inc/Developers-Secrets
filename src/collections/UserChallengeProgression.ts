import { CollectionConfig } from 'payload'

export const UserChallengeProgression: CollectionConfig = {
  slug: 'userChallengeProgression',
  admin: {
    useAsTitle: 'userId',
    defaultColumns: ['userId', 'challengeSlug', 'hasLiked', 'hasDisliked', 'createdAt'],
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
      name: 'challengeSlug',
      type: 'text',
      required: true,
      admin: {
        description: 'Slug of the challenge',
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
      admin: {
        description: 'User rating for this challenge (1-5)',
      },
    },
  ],
  indexes: [
    {
      fields: ['userId', 'challengeSlug'],
      unique: true,
    },
  ],
}
