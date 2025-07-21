import type { CollectionConfig } from 'payload'

export const ChallengesRatings: CollectionConfig = {
  slug: 'challenges-ratings',
  fields: [
    {
      name: 'challenge',
      label: 'Challenge',
      type: 'relationship',
      relationTo: 'challenges',
      required: true,
      admin: {
        description: 'The challenge this rating aggregate is for',
      },
    },
    {
      name: 'total',
      label: 'Total Rating Points',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Sum of all rating points',
        readOnly: true,
      },
    },
    {
      name: 'count',
      label: 'Rating Count',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of ratings received',
        readOnly: true,
      },
    },
    {
      name: 'average',
      label: 'Average Rating',
      type: 'number',
      admin: {
        description: 'Average rating (0-5)',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            const total = siblingData?.total || 0
            const count = siblingData?.count || 0

            if (count > 0) {
              return parseFloat((total / count).toFixed(1))
            }
            return 0
          },
        ],
      },
    },
  ],
}
