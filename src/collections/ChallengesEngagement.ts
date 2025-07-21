import type { CollectionConfig } from 'payload'

export const ChallengesEngagement: CollectionConfig = {
  slug: 'challenges-engagement',
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
      name: 'likes',
      label: 'Likes',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of likes',
        readOnly: true,
      },
    },
    {
      name: 'dislikes',
      label: 'Dislikes',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of dislikes',
        readOnly: true,
      },
    },
  ],
}
