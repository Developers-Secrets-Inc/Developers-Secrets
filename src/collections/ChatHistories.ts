import type { CollectionConfig } from 'payload'

export const ChatHistories: CollectionConfig = {
  slug: 'chat-histories',
  upload: {
    staticDir: './chat-histories',
    mimeTypes: ['application/json'],
    disableLocalStorage: true,
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'chat', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  labels: {
    singular: 'Chat History File',
    plural: 'Chat History Files',
  },
  fields: [
    {
      name: 'chat',
      label: 'Associated Chat',
      type: 'relationship',
      relationTo: 'challenge-ai-chats',
      required: true,
      unique: true,
    },
  ],
}
    