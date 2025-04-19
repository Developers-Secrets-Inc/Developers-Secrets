import type { CollectionConfig } from 'payload'

export const ActiveEffects: CollectionConfig = {
  slug: 'active-effects',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['userId', 'effectType', 'multiplier', 'expiresAt'],
  },
  fields: [
    {
      name: 'userId',
      label: 'User ID',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'The ID of the user who has this active effect',
      },
    },
    {
      name: 'effectType',
      label: 'Effect Type',
      type: 'select',
      required: true,
      options: [
        { label: 'XP Boost', value: 'xpBoost' },
        { label: 'Currency Boost', value: 'currencyBoost' },
        { label: 'Streak Restore', value: 'streakRestore' },
        { label: 'Unlock Feature', value: 'unlockFeature' },
      ],
      admin: {
        description: 'The type of effect that is active',
      },
    },
    {
      name: 'multiplier',
      label: 'Effect Multiplier',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'The multiplier value for this effect (e.g. 1.5 for 50% boost)',
      },
    },
    {
      name: 'activatedAt',
      label: 'Activated At',
      type: 'date',
      required: true,
      admin: {
        description: 'When this effect was activated',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'expiresAt',
      label: 'Expires At',
      type: 'date',
      required: true,
      admin: {
        description: 'When this effect will expire',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'isActive',
      label: 'Is Active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this effect is currently active',
      },
    },
  ],
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'effectType', 'isActive'],
    },
    {
      fields: ['expiresAt'],
    },
  ],
}
