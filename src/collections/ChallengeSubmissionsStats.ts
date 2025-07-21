import type { CollectionConfig } from 'payload'

export const ChallengeSubmissionsStats: CollectionConfig = {
  slug: 'challenge-submissions-stats',
  fields: [
    {
      name: 'challenge',
      label: 'Challenge',
      type: 'relationship',
      relationTo: 'challenges',
      required: true,
      admin: {
        description: 'The challenge this stats entry is for',
      },
    },
    {
      name: 'acceptedSolutions',
      label: 'Accepted Solutions',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of accepted solutions',
      },
    },
    {
      name: 'failedSolutions',
      label: 'Failed Solutions',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of failed solutions',
      },
    },
    {
      name: 'totalSubmissions',
      label: 'Total Submissions',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total number of submissions',
      },
    },
    {
      name: 'acceptanceRate',
      label: 'Acceptance Rate',
      type: 'number',
      admin: {
        description: 'Percentage of accepted submissions (0-100)',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            const totalSubmissions = siblingData?.totalSubmissions || 0
            const acceptedSolutions = siblingData?.acceptedSolutions || 0
            if (totalSubmissions > 0) {
              return (acceptedSolutions / totalSubmissions) * 100
            }
            return 0
          },
        ],
      },
    },
  ],
}
