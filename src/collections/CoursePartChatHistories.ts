import type { CollectionConfig } from 'payload'

export const CoursePartChatHistories: CollectionConfig = {
  slug: 'course-part-chat-histories',
  upload: {
    staticDir: './course-part-chat-histories',
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
      relationTo: 'course-part-ai-chats',
      required: true,
      unique: true,
    },
  ],
}
    