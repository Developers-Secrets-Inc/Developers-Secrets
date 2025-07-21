import { CollectionConfig } from 'payload'

export const UserChallengeCompletionStatus: CollectionConfig = {
  slug: 'userChallengeCompletionStatus',
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
  ],
}
