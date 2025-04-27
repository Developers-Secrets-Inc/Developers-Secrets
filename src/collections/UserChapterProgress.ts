import type { CollectionConfig } from 'payload'

export const UserChapterProgress: CollectionConfig = {
  slug: 'userChapterProgress',
  admin: {
    useAsTitle: 'id', // Or maybe combine user/chapter later
    defaultColumns: ['userId', 'chapter', 'completionStatus', 'updatedAt'],
    description: 'Tracks user progression status for entire course chapters.',
    group: 'User Data', // Group with other user progress data
  },
  fields: [
    {
      name: 'userId',
      label: 'User ID',
      type: 'text', // Assuming text user ID
      required: true,
      index: true,
      admin: {
        description: 'The ID of the user.',
        readOnly: true,
      },
    },
    {
      name: 'chapter',
      label: 'Chapter',
      type: 'relationship',
      relationTo: 'chapters',
      required: true,
      hasMany: false,
      index: true,
      admin: {
        description: 'The specific chapter this progression refers to.',
        readOnly: true,
      },
    },
    {
      name: 'completionStatus',
      label: 'Completion Status',
      type: 'select',
      options: [
        { label: 'Not Started', value: 'not_started' },
        { label: 'In Progress', value: 'in_progress' }, // Might be useful later
        { label: 'Completed', value: 'completed' },
      ],
      defaultValue: 'not_started',
      required: true,
      index: true, // Allow filtering/sorting by status
      admin: {
        description: 'The overall completion status of the chapter for the user.',
      },
    },
    // Optional: Add fields like completedAt if needed
    // {
    //   name: 'completedAt',
    //   label: 'Completed At',
    //   type: 'date',
    //   admin: {
    //     readOnly: true,
    //   }
    // }
  ],
  timestamps: true, // Adds createdAt and updatedAt
  // TODO: Add a unique compound index on (userId, chapter) using hooks or database constraints
  // to prevent duplicate entries for the same user and chapter.
} 