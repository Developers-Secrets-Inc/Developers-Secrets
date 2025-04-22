import type { CollectionConfig } from 'payload'

export const Divisions: CollectionConfig = {
  slug: 'divisions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'levelRequirement', 'promotionThreshold', 'demotionThreshold'],
  },
  fields: [
    {
      name: 'name',
      label: 'Division Name',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'levelRequirement',
      label: 'Minimum Level Requirement',
      type: 'number',
      admin: {
        description:
          'Optional: Minimum user level required to be initially placed in this division.',
      },
    },
    {
      name: 'promotionThreshold',
      label: 'Promotion Threshold (%)',
      type: 'number',
      required: true,
      min: 0,
      max: 100,
      admin: {
        description: 'Top X% of users in a weekly leaderboard group to be promoted.',
      },
    },
    {
      name: 'demotionThreshold',
      label: 'Demotion Threshold (%)',
      type: 'number',
      required: true,
      min: 0,
      max: 100,
      admin: {
        description: 'Bottom X% of users in a weekly leaderboard group to be demoted.',
      },
    },
    // TODO: Add Rewards field (Array of Blocks)
    // {
    //   name: 'rewards',
    //   label: 'Rank Rewards',
    //   type: 'blocks',
    //   minRows: 0,
    //   maxRows: 10,
    //   blocks: [
    //     // Define reward blocks (e.g., CoinReward, ItemReward)
    //   ],
    // },
    {
      name: 'rankOrder',
      label: 'Rank Order',
      type: 'number',
      unique: true,
      index: true,
      admin: {
        description:
          'Numerical order for divisions (e.g., 1 for Bronze, 2 for Silver). Lower numbers are lower ranks.',
        step: 1,
      },
    },
    // Define Rewards field as an array
    {
      name: 'rewards',
      label: 'Rank Rewards (Coins)',
      type: 'array',
      minRows: 0,
      maxRows: 10, // Adjust as needed
      admin: {
        description: 'Define coin rewards based on final weekly rank ranges.',
      },
      fields: [
        // Fields for each reward definition in the array
        {
          name: 'rankStart',
          label: 'Rank Start (Inclusive)',
          type: 'number',
          required: true,
          min: 1,
          admin: {
            description: 'The starting rank for this reward tier.',
            width: '30%',
          },
        },
        {
          name: 'rankEnd',
          label: 'Rank End (Inclusive)',
          type: 'number',
          required: true,
          min: 1,
          admin: {
            description: 'The ending rank for this reward tier.',
            width: '30%',
          },
        },
        {
          name: 'coinAmount',
          label: 'Coin Amount',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'The number of coins to award for this rank range.',
            width: '40%',
          },
        },
      ],
    },
  ],
}
