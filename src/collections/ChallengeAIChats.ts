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
      name: 'chatHistory',
      label: 'Chat History File',
      type: 'relationship',
      relationTo: 'chat-histories',
      required: false,
    },
    // Optionally, quotaUsed or other fields can be added later
  ],
}
