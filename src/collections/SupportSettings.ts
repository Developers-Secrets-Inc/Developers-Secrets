import type { CollectionConfig } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'

export const SupportSettings: CollectionConfig = {
  slug: 'support-settings',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'updatedAt'],
  },
  access: {
    // Only authenticated users can modify support settings
    update: ({ req: { user } }) => {
      return Boolean(user)
    },
    delete: ({ req: { user } }) => {
      return Boolean(user)
    },
    create: ({ req: { user } }) => {
      return Boolean(user)
    },
    // Anyone can read support settings
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      defaultValue: 'Support Settings',
      admin: {
        description: 'Name of the settings (should be "Support Settings")',
      },
    },
    {
      name: 'status',
      label: 'Support Status',
      type: 'select',
      required: true,
      defaultValue: 'online',
      options: [
        {
          label: 'Online',
          value: 'online',
        },
        {
          label: 'Maintenance',
          value: 'maintenance',
        },
        {
          label: 'Offline',
          value: 'offline',
        },
      ],
      admin: {
        description: 'Current status of the support system',
      },
    },
    {
      name: 'maintenanceMessage',
      label: 'Maintenance Message',
      type: 'textarea',
      admin: {
        description: 'Message to display when support is in maintenance mode',
      },
      defaultValue:
        'Our support system is currently undergoing maintenance. Please try again later.',
    },
    {
      name: 'offlineMessage',
      label: 'Offline Message',
      type: 'textarea',
      admin: {
        description: 'Message to display when support is offline',
      },
      defaultValue:
        'Our support system is currently offline. Please email us at support@developerssecrets.com.',
    },
  ],
  hooks: {
    beforeChange: [
      // Ensure there's only one support settings document
      async ({ operation, data, req }) => {
        if (operation === 'create') {
          try {
            // Utiliser req.payload au lieu de global.payload
            const existingSettings = await req.payload.find({
              collection: 'support-settings',
              limit: 1,
            })

            if (existingSettings.totalDocs > 0) {
              throw new Error('Only one support settings document can exist')
            }
          } catch (error) {
            console.error('Error in beforeChange hook:', error)
            // Si une erreur se produit lors de la vérification, on continue quand même
            // pour éviter de bloquer complètement la création
          }
        }
        return data
      },
    ],
  },
}
