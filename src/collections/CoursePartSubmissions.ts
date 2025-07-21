import type { CollectionConfig } from 'payload'

// Mirrors ChallengeSubmissions but for course parts
export const CoursePartSubmissions: CollectionConfig = {
  slug: 'coursePartSubmissions',
  admin: {
    useAsTitle: 'id', // Or potentially combine user/part info later
    defaultColumns: ['part', 'submissionType', 'testsPassed', 'testsTotal', 'createdAt'],
    group: 'User Data', // Group with other user-specific data
    description: 'Tracks code submissions made by users for specific course parts.',
  },
  fields: [
    {
      name: 'submissionType',
      label: 'Submission Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Accepted', value: 'accepted' }, // All tests passed
        { label: 'Runtime Error', value: 'runtimeError' },
        { label: 'Wrong Answer', value: 'wrongAnswer' },
        { label: 'Time Limit Exceeded', value: 'timeLimitExceeded' },
      ],
      admin: {
        description: 'Result status of the submission for the course part code check.',
      },
    },
    {
      name: 'part',
      label: 'Course Part',
      type: 'relationship',
      relationTo: 'courseParts', // Changed from 'challenges'
      required: true,
      index: true,
      admin: {
        description: 'The course part this submission belongs to.',
      },
    },
    {
      name: 'authorId',
      label: 'Author ID',
      type: 'text', // Assuming text user ID
      required: true,
      index: true,
      admin: {
        description: 'The ID of the user who made this submission.',
      },
    },
    {
      name: 'testsPassed',
      label: 'Tests Passed',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Number of test cases passed.',
      },
    },
    {
      name: 'testsTotal',
      label: 'Tests Total',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Total number of test cases for the part.',
      },
    },
    {
      name: 'code',
      label: 'Submitted Code',
      type: 'group',
      fields: [
        {
          name: 'language',
          type: 'text',
          required: true,
          admin: {
            description: 'Programming language used.',
          },
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Source code submitted.',
          },
        },
      ],
    },
    // Conditional fields for failures (copied structure from ChallengeSubmissions)
    {
      name: 'error',
      type: 'textarea',
      admin: {
        description: 'Error message for runtime error submissions.',
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
        description: 'Last expected outputs (for runtime/timeout errors).',
        condition: (data) =>
          data.submissionType === 'runtimeError' || data.submissionType === 'timeLimitExceeded',
      },
    },
    {
      name: 'input',
      type: 'textarea',
      admin: {
        description: 'Input that caused the wrong answer.',
        condition: (data) => data.submissionType === 'wrongAnswer',
      },
    },
    {
      name: 'output',
      type: 'textarea',
      admin: {
        description: 'Actual output produced for wrong answer.',
        condition: (data) => data.submissionType === 'wrongAnswer',
      },
    },
    {
      name: 'expectedOutput',
      type: 'textarea',
      admin: {
        description: 'Expected output for wrong answer.',
        condition: (data) => data.submissionType === 'wrongAnswer',
      },
    },
    // Removed createdAt field, relying on default timestamps
  ],
  timestamps: true, // Automatically add createdAt and updatedAt
}
