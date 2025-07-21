import type { CollectionConfig } from 'payload'

export const CoursePartFeedback: CollectionConfig = {
  slug: 'coursePartFeedback',
  admin: {
    useAsTitle: 'details', // Use details for title initially, maybe refine later
    defaultColumns: ['part', 'feedbackType', 'status', 'user', 'createdAt'],
    group: 'User Feedback', // New group for feedback
    description: 'Feedback submitted by users for specific course parts.',
  },
  fields: [
    {
      name: 'part',
      label: 'Course Part',
      type: 'relationship',
      relationTo: 'courseParts',
      required: true,
      hasMany: false,
      index: true,
      admin: {
        description: 'The specific course part this feedback relates to.',
      },
    },
    {
      name: 'feedbackType',
      label: 'Feedback Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Typo / Spelling Mistake', value: 'typo' },
        { label: 'Technical Error / Bug', value: 'error' },
        { label: 'Unclear Content / Explanation', value: 'unclear' },
        { label: 'Suggestion', value: 'suggestion' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'The category of the feedback provided.',
      },
    },
    {
      name: 'details',
      label: 'Feedback Details',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The detailed feedback submitted by the user.',
      },
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Acknowledged', value: 'acknowledged' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      index: true,
      admin: {
        description: 'The current status of this feedback item.',
        position: 'sidebar',
      },
    },
    {
      name: 'userId',
      label: 'Submitted By (User ID)',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'The UUID of the user who submitted the feedback.',
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  timestamps: true, // Adds createdAt and updatedAt automatically
}
