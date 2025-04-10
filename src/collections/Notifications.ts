import type { CollectionConfig } from 'payload'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'content',
  },
  fields: [
    {
      name: 'userId',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'content',
      type: 'text',
      required: true,
    },
    {
      name: 'importance',
      type: 'select',
      required: true,
      options: [
        {
          label: 'High',
          value: 'high',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'Low',
          value: 'low',
        },
      ],
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'System',
          value: 'system',
        },
        {
          label: 'Challenge',
          value: 'challenge',
        },
        {
          label: 'Achievement',
          value: 'achievement',
        },
        {
          label: 'Social',
          value: 'social',
        },
      ],
    },
    {
      name: 'isRead',
      type: 'checkbox',
      defaultValue: false,
      index: true,
    },
    {
      name: 'actionUrl',
      type: 'text',
      admin: {
        description: 'Optional URL or route for the notification action',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        description: 'Optional expiration date for the notification',
      },
    },
  ],
}
