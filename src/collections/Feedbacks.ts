import type { CollectionConfig } from 'payload'

export const Feedbacks: CollectionConfig = {
  slug: 'feedbacks',
  admin: {
    useAsTitle: 'message',
    defaultColumns: ['message', 'createdAt', 'ipAddress'],
  },
  access: {
    // Only authenticated users can modify or delete feedbacks
    update: ({ req: { user } }) => {
      return Boolean(user)
    },
    delete: ({ req: { user } }) => {
      return Boolean(user)
    },
    // Anyone can create feedbacks (with rate limiting handled in server action)
    create: () => true,
    // Only authenticated users can read feedbacks
    read: ({ req: { user } }) => {
      return Boolean(user)
    },
  },
  fields: [
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'articleSlug',
      label: 'Article Slug',
      type: 'text',
      admin: {
        description: 'The slug of the article where the feedback was submitted',
      },
    },
    {
      name: 'tutorialSlug',
      label: 'Tutorial Slug',
      type: 'text',
      admin: {
        description: 'The slug of the tutorial where the feedback was submitted',
      },
    },
    {
      name: 'ipAddress',
      label: 'IP Address',
      type: 'text',
      admin: {
        description: 'IP address of the user who submitted the feedback (for rate limiting)',
      },
    },
  ],
}
