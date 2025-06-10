import type { CollectionConfig } from 'payload'

export const BlogArticles: CollectionConfig = {
  slug: 'blog-articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'category', 'updatedAt'],
  },
  access: {
    read: () => true, // Anyone can read blog articles
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly identifier for this blog article. Will be used in the URL.',
      },
    },
    {
      name: 'content',
      label: 'Content',
      type: 'textarea', // Store markdown content here
      required: true,
      admin: {
        description: 'The main content of the blog article, written in Markdown.',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'A brief description or summary of the blog article.',
      },
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { label: 'Engineering', value: 'engineering' },
        { label: 'Changelog', value: 'changelog' },
      ],
      required: true,
      admin: {
        description: 'The category this blog article belongs to.',
      },
    },
    {
      name: 'author',
      label: 'Author',
      type: 'relationship',
      relationTo: 'users', // Assuming 'users' collection exists for authors
      required: true,
    },
    {
      name: 'publishedAt',
      label: 'Published At',
      type: 'date',
      admin: {
        description: 'The date and time when the article was published.',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      defaultValue: () => new Date(),
    },
  ],
  timestamps: true, // Adds createdAt and updatedAt automatically
}
