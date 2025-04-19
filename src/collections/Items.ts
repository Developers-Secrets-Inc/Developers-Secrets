import type { CollectionConfig } from 'payload'

export const Items: CollectionConfig = {
  slug: 'items',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'activationMode', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      admin: {
        description: 'The name of the item',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'A detailed description of what this item does',
      },
    },
    {
      name: 'type',
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
        description: 'The type of effect this item provides',
      },
    },
    {
      name: 'activationMode',
      label: 'Activation Mode',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Consumable Duration',
          value: 'consumableDuration',
        },
        {
          label: 'Instant',
          value: 'instant',
        },
        {
          label: 'Passive',
          value: 'passive',
        },
      ],
      admin: {
        description: 'How this item is activated and used',
      },
    },
    {
      name: 'multiplier',
      label: 'Effect Multiplier',
      type: 'number',
      min: 0,
      admin: {
        description: 'Multiplier value for boost effects (e.g. 1.5 for 50% boost)',
        condition: (data) => ['xpBoost', 'currencyBoost'].includes(data?.type),
      },
    },
    {
      name: 'duration',
      label: 'Effect Duration',
      type: 'number',
      min: 0,
      admin: {
        description: 'Duration of the effect in seconds (only for consumable duration items)',
        condition: (data) => data?.activationMode === 'consumableDuration',
      },
    },
    {
      name: 'appliesPassively',
      label: 'Applies Passively',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this item provides its effect just by being owned',
      },
    },
    {
      name: 'icon',
      label: 'Item Icon',
      type: 'text',
      admin: {
        description: 'Icon identifier for this item',
      },
    },
    {
      name: 'rarity',
      label: 'Rarity',
      type: 'select',
      required: true,
      options: [
        { label: 'Common', value: 'common' },
        { label: 'Rare', value: 'rare' },
        { label: 'Epic', value: 'epic' },
        { label: 'Legendary', value: 'legendary' },
      ],
      defaultValue: 'common',
      admin: {
        description: 'The rarity level of this item',
      },
    },
    {
      name: 'isActive',
      label: 'Is Active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this item is currently available in the game',
      },
    },
  ],
  timestamps: true, // Adds createdAt and updatedAt automatically
}
