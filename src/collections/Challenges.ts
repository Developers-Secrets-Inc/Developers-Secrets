import type { CollectionConfig } from 'payload'

// Fonction pour calculer l'expérience basée sur la difficulté
const calculateExperience = (difficulty: string): number => {
  const difficultyRanks: Record<string, number> = {
    easy: 1,
    medium: 2,
    hard: 3,
    horrible: 4,
  }

  // Base: 50 points par rang de difficulté
  return 50 * (difficultyRanks[difficulty] || 1)
}

export const Challenges: CollectionConfig = {
  slug: 'challenges',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'difficulty', 'baseExperience', 'engagement', 'createdAt'],
  },
  // Enable version system with drafts
  versions: {
    drafts: true,
  },
  access: {
    read: () => true, // Tous les utilisateurs peuvent lire les challenges
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the challenge',
      },
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      admin: {
        description: 'URL-friendly identifier for this challenge. Will be used in the URL.',
      },
      // Vous pourriez activer l'auto-génération du slug basé sur le titre si nécessaire
      // hooks: {
      //   beforeValidate: [
      //     ({ data }) => {
      //       // Générer un slug à partir du titre
      //     },
      //   ],
      // },
    },
    {
      name: 'difficulty',
      label: 'Difficulty',
      type: 'select',
      options: [
        { label: 'Easy', value: 'easy' },
        { label: 'Medium', value: 'medium' },
        { label: 'Hard', value: 'hard' },
        { label: 'Horrible', value: 'horrible' },
      ],
      required: true,
      defaultValue: 'medium',
      admin: {
        description: 'The difficulty level of the challenge',
        position: 'sidebar',
      },
    },
    {
      name: 'baseExperience',
      label: 'Base Experience',
      type: 'number',
      admin: {
        description:
          'Experience points awarded for completing this challenge (calculated automatically)',
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            // Calculer automatiquement l'expérience basée sur la difficulté
            if (data?.difficulty) {
              return calculateExperience(data.difficulty)
            }
            return 50 // Valeur par défaut si la difficulté n'est pas définie
          },
        ],
      },
    },
    {
      name: 'ratings',
      label: 'Ratings',
      type: 'group',
      admin: {
        description: 'User ratings for this challenge',
        position: 'sidebar',
      },
      fields: [
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
    },
    {
      name: 'concepts',
      label: 'Concepts',
      type: 'array',
      admin: {
        description: 'Programming concepts covered by this challenge',
      },
      fields: [
        {
          name: 'concept',
          label: 'Concept',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'engagement',
      label: 'Engagement',
      type: 'group',
      admin: {
        description: 'Challenge engagement metrics',
        position: 'sidebar',
      },
      fields: [
        {
          name: 'likes',
          label: 'Likes',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of likes received',
            readOnly: true,
          },
        },
        {
          name: 'dislikes',
          label: 'Dislikes',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of dislikes received',
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'description',
      label: 'Description',
      type: 'group',
      admin: {
        description: 'Challenge description and problem statement',
      },
      fields: [
        {
          name: 'statement',
          label: 'Statement',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Problem statement and challenge description',
          },
        },
        {
          name: 'submissionStats',
          label: 'Submission Statistics',
          type: 'group',
          admin: {
            description: 'Statistics about challenge submissions',
          },
          fields: [
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
        },
        {
          name: 'hints',
          label: 'Hints',
          type: 'array',
          admin: {
            description: 'Helpful hints for solving the challenge',
          },
          fields: [
            {
              name: 'content',
              label: 'Hint Content',
              type: 'textarea',
              required: true,
            },
          ],
        },
        {
          name: 'similarChallenges',
          label: 'Similar Challenges',
          type: 'array',
          admin: {
            description: 'List of related challenges',
          },
          fields: [
            {
              name: 'challenge',
              label: 'Challenge',
              type: 'relationship',
              relationTo: 'challenges',
              required: true,
              admin: {
                description: 'Select a related challenge',
              },
            },
          ],
        },
        {
          name: 'comments',
          label: 'Comments',
          type: 'relationship',
          relationTo: 'comments',
          hasMany: true,
          filterOptions: {
            targetType: {
              equals: 'description',
            },
          },
          admin: {
            description: 'Comments on this challenge description',
          },
        },
      ],
    },
    {
      name: 'officialSolution',
      label: 'Official Solution',
      type: 'group',
      admin: {
        description: 'The official solution for this challenge',
      },
      fields: [
        {
          name: 'statement',
          label: 'Solution Statement',
          type: 'textarea',
          required: true,
          admin: {
            description: 'The content of the official solution',
          },
        },
        {
          name: 'comments',
          label: 'Comments',
          type: 'relationship',
          relationTo: 'comments',
          hasMany: true,
          filterOptions: {
            targetType: {
              equals: 'officialSolution',
            },
          },
          admin: {
            description: 'Comments on this official solution',
          },
        },
      ],
    },
    {
      name: 'userSolutions',
      label: 'User Solutions',
      type: 'array',
      admin: {
        description: 'Solutions submitted by users for this challenge',
      },
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          required: true,
          admin: {
            description: 'Title of the solution',
          },
        },
        {
          name: 'authorId',
          label: 'Author ID',
          type: 'text',
          required: true,
          admin: {
            description: 'ID of the user who submitted this solution',
          },
        },
        {
          name: 'statement',
          label: 'Solution Statement',
          type: 'textarea',
          required: true,
          admin: {
            description: 'The content of the user solution',
          },
        },
        {
          name: 'views',
          label: 'Views',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of times this solution has been viewed',
          },
        },
        {
          name: 'votes',
          label: 'Votes',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of votes received for this solution',
          },
        },
        {
          name: 'createdAt',
          label: 'Created At',
          type: 'date',
          admin: {
            description: 'When this solution was submitted',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'comments',
          label: 'Comments',
          type: 'relationship',
          relationTo: 'comments',
          hasMany: true,
          filterOptions: {
            targetType: {
              equals: 'userSolution',
            },
          },
          admin: {
            description: 'Comments on this user solution',
          },
        },
      ],
    },
    {
      name: 'submissions',
      label: 'Submissions',
      type: 'array',
      admin: {
        description: 'Submissions made by users for this challenge',
      },
      fields: [
        {
          name: 'submissionType',
          label: 'Submission Type',
          type: 'select',
          required: true,
          options: [
            { label: 'Accepted', value: 'accepted' },
            { label: 'Runtime Error', value: 'runtimeError' },
            { label: 'Wrong Answer', value: 'wrongAnswer' },
            { label: 'Time Limit Exceeded', value: 'timeLimitExceeded' },
          ],
          admin: {
            description: 'Type of submission result',
          },
        },
        {
          name: 'authorId',
          label: 'Author ID',
          type: 'text',
          required: true,
          admin: {
            description: 'ID of the user who made this submission',
          },
        },
        {
          name: 'testsPassed',
          label: 'Tests Passed',
          type: 'number',
          required: true,
          admin: {
            description: 'Number of test cases passed',
          },
        },
        {
          name: 'testsTotal',
          label: 'Tests Total',
          type: 'number',
          required: true,
          admin: {
            description: 'Total number of test cases',
          },
        },
        {
          name: 'createdAt',
          label: 'Created At',
          type: 'date',
          admin: {
            description: 'When this submission was made',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        // Champs spécifiques au Runtime Error
        {
          name: 'error',
          label: 'Error Message',
          type: 'textarea',
          admin: {
            description: 'Error message (for Runtime Error submissions)',
            condition: (data, siblingData) => siblingData?.submissionType === 'runtimeError',
          },
        },
        // Champs spécifiques au Wrong Answer
        {
          name: 'input',
          label: 'Input',
          type: 'textarea',
          admin: {
            description: 'Test case input (for Wrong Answer submissions)',
            condition: (data, siblingData) => siblingData?.submissionType === 'wrongAnswer',
          },
        },
        {
          name: 'output',
          label: 'Output',
          type: 'textarea',
          admin: {
            description: "User's output (for Wrong Answer submissions)",
            condition: (data, siblingData) => siblingData?.submissionType === 'wrongAnswer',
          },
        },
        {
          name: 'expectedOutput',
          label: 'Expected Output',
          type: 'textarea',
          admin: {
            description: 'Expected output (for Wrong Answer submissions)',
            condition: (data, siblingData) => siblingData?.submissionType === 'wrongAnswer',
          },
        },
        // Champs communs à Runtime Error et Time Limit Exceeded
        {
          name: 'lastExpectedOutput',
          label: 'Last Expected Output',
          type: 'array',
          admin: {
            description:
              'Last expected output parameters (for Runtime Error and Time Limit Exceeded submissions)',
            condition: (data, siblingData) =>
              siblingData?.submissionType === 'runtimeError' ||
              siblingData?.submissionType === 'timeLimitExceeded',
          },
          fields: [
            {
              name: 'param',
              label: 'Parameter Name',
              type: 'text',
              required: true,
            },
            {
              name: 'value',
              label: 'Parameter Value',
              type: 'textarea',
              required: true,
            },
          ],
        },
        // Code de soumission (commun à tous les types)
        {
          name: 'code',
          label: 'Code',
          type: 'group',
          admin: {
            description: 'The submitted code',
          },
          fields: [
            {
              name: 'language',
              label: 'Language',
              type: 'text',
              required: true,
              admin: {
                description: 'Programming language of the submission',
              },
            },
            {
              name: 'content',
              label: 'Content',
              type: 'textarea',
              required: true,
              admin: {
                description: 'The code content',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'code',
      label: 'Challenge Code',
      type: 'group',
      admin: {
        description: 'Code related information for this challenge',
      },
      fields: [
        {
          name: 'language',
          label: 'Language',
          type: 'text',
          required: true,
          admin: {
            description: 'Default programming language for the challenge',
          },
        },
        {
          name: 'initialCode',
          label: 'Initial Code',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Initial code provided to users',
          },
        },
        {
          name: 'testCases',
          label: 'Test Cases',
          type: 'array',
          admin: {
            description: 'Test cases for validating solutions',
          },
          fields: [
            {
              name: 'input',
              label: 'Input',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Input data for the test case',
              },
            },
            {
              name: 'expectedOutput',
              label: 'Expected Output',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Expected output for this test case',
              },
            },
          ],
        },
      ],
    },
  ],
  timestamps: true, // Ajout automatique des champs createdAt et updatedAt
}
