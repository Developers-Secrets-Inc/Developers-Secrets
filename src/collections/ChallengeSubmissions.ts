import type { CollectionConfig } from 'payload'

export const ChallengeSubmissions: CollectionConfig = {
  slug: 'challenge-submissions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'submissionType', 'testsPassed', 'testsTotal', 'createdAt'],
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
      name: 'challenge',
      type: 'relationship',
      relationTo: 'challenges',
      required: true,
      admin: {
        description: 'The challenge this submission is for',
      },
    },
    {
      name: 'authorId',
      type: 'text',
      required: true,
      admin: {
        description: 'The user who made this submission',
      },
    },
    {
      name: 'testsPassed',
      label: 'Tests Passed',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Number of test cases passed',
      },
    },
    {
      name: 'testsTotal',
      label: 'Tests Total',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Total number of test cases',
      },
    },
    {
      name: 'code',
      type: 'group',
      fields: [
        {
          name: 'language',
          type: 'text',
          required: true,
          admin: {
            description: 'Programming language used for the submission',
          },
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Source code of the submission',
          },
        },
      ],
    },
    // Champs spécifiques pour Runtime Error
    {
      name: 'error',
      type: 'textarea',
      admin: {
        description: 'Error message for runtime error submissions',
        condition: (data) => data.submissionType === 'runtimeError',
      },
    },
    {
      name: 'lastExpectedOutput',
      type: 'array',
      fields: [
        {
          name: 'output',
          type: 'text',
        },
      ],
      admin: {
        description: 'Last expected outputs before the error occurred',
        condition: (data) => data.submissionType === 'runtimeError' || data.submissionType === 'timeLimitExceeded',
      },
    },
    // Champs spécifiques pour Wrong Answer
    {
      name: 'input',
      type: 'textarea',
      admin: {
        description: 'Input that caused the wrong answer',
        condition: (data) => data.submissionType === 'wrongAnswer',
      },
    },
    {
      name: 'output',
      type: 'textarea',
      admin: {
        description: 'Actual output produced by the submission',
        condition: (data) => data.submissionType === 'wrongAnswer',
      },
    },
    {
      name: 'expectedOutput',
      type: 'textarea',
      admin: {
        description: 'Expected output for the given input',
        condition: (data) => data.submissionType === 'wrongAnswer',
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'When this submission was made',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
} 