import type { CollectionConfig } from 'payload'

export const ChallengeAIChats: CollectionConfig = {
  slug: 'challenge-ai-chats',
  admin: {
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'userId',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'challenge',
      type: 'relationship',
      relationTo: 'challenges',
      required: true,
      index: true,
    },
    {
      name: 'messages',
      type: 'json',
      required: true,
      defaultValue: [],
    },
    // Optionally, quotaUsed or other fields can be added later
  ],
}
