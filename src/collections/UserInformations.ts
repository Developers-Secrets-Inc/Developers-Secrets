import type { CollectionConfig } from 'payload'

export const UserInformations: CollectionConfig = {
  slug: 'user-informations',
  admin: {
    useAsTitle: 'userId',
    defaultColumns: ['userId', 'role'],
  },
  labels: {
    singular: 'User Information',
    plural: 'User Informations',
  },
  fields: [
    {
      name: 'userId',
      label: 'User ID',
      type: 'text',
      required: true,
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
    },
    {
      name: 'avatar',
      label: 'Avatar',
      type: 'text',
    },
    {
      name: 'initials',
      label: 'Initials',
      type: 'text',
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      options: [
        {
          label: 'Basic',
          value: 'basic',
        },
        {
          label: 'Lite',
          value: 'lite',
        },
        {
          label: 'Pro',
          value: 'pro',
        },
        {
          label: 'Max',
          value: 'max',
        },
        {
          label: 'Admin',
          value: 'admin',
        },
      ],
      defaultValue: 'basic',
      required: true,
    },
    {
      name: 'permissions',
      label: 'Permissions',
      type: 'relationship',
      relationTo: 'permissions',
      hasMany: true,
      admin: {
        description: 'Select permissions for this user',
      },
    },
    {
      name: 'preferences',
      label: 'Preferences',
      type: 'group',
      fields: [
        {
          name: 'notifications',
          label: 'Notification Preferences',
          type: 'group',
          fields: [
            {
              name: 'friends',
              label: 'Friends Notifications',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
        {
          name: 'emails',
          label: 'Email Preferences',
          type: 'group',
          fields: [
            {
              name: 'marketing',
              label: 'Marketing Emails',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'affiliates',
              label: 'Affiliate Emails',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
        {
          name: 'theme',
          label: 'Theme',
          type: 'select',
          options: [
            {
              label: 'Light',
              value: 'light',
            },
            {
              label: 'Dark',
              value: 'dark',
            },
            {
              label: 'System',
              value: 'system',
            },
          ],
          defaultValue: 'system',
        },
      ],
    },
    {
      name: 'customerId',
      label: 'Customer ID',
      type: 'text',
    },
  ],
}
