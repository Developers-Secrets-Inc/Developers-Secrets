import type { CollectionConfig } from 'payload'

export const CoursePartAIChats: CollectionConfig = {
  slug: 'course-part-ai-chats',
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
      name: 'coursePart',
      type: 'relationship',
      relationTo: 'courseParts',
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
