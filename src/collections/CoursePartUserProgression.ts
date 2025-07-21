import type { CollectionConfig } from 'payload'

export const CoursePartUserProgression: CollectionConfig = {
  slug: 'coursePartUserProgression',
  admin: {
    useAsTitle: 'id', // Improve later if needed
    defaultColumns: ['userId', 'part', 'engagementStatus', 'completionStatus', 'updatedAt'],
    description: 'Tracks user progression and engagement for specific course parts.',
    group: 'User Data', // Or another relevant group
  },
  fields: [
    {
      name: 'userId',
      label: 'User ID',
      type: 'text', // As requested, text user ID
      required: true,
      index: true,
      admin: {
        description: 'The ID of the user who engaged with the part.',
        readOnly: true,
      },
    },
    {
      name: 'part',
      label: 'Course Part',
      type: 'relationship',
      relationTo: 'courseParts',
      required: true,
      hasMany: false,
      index: true,
      admin: {
        description: 'The specific course part the user engaged with.',
        readOnly: true,
      },
    },
    {
      name: 'engagementStatus',
      label: 'Engagement Status',
      type: 'select',
      options: [
        { label: 'Liked', value: 'liked' },
        { label: 'Disliked', value: 'disliked' },
        { label: 'None', value: 'none' }, // Represents no active action
      ],
      defaultValue: 'none',
      required: true,
      index: true,
      admin: {
        description: "The user's like/dislike status for this part.",
      },
    },
    {
      name: 'completionStatus',
      label: 'Completion Status',
      type: 'select',
      options: [
        { label: 'Not Started', value: 'not_started' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
      ],
      defaultValue: 'not_started',
      required: true,
      index: true, // Allow filtering/sorting by status
      admin: {
        description: 'The completion status of the part for the user.',
      },
    },
    {
      name: 'isSolutionUnlocked',
      label: 'Solution Unlocked?',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      index: true, // Useful for potential future filtering
      admin: {
        description: 'Indicates if the user has viewed the official solution for this part.',
        readOnly: true, // Should only be modified programmatically
        position: 'sidebar', // Place it in the sidebar for better organization
      },
    },
  ],
  timestamps: true, // Adds createdAt and updatedAt
  // Note: Compound unique index (userId, part) should be enforced via hooks if needed,
  // as 'indexes' is not a top-level CollectionConfig property.
}
