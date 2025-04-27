import type { CollectionConfig, Field } from 'payload'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'difficulty', 'updatedAt'],
    group: 'Courses',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Course Name',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
            },
            {
              name: 'requiredCourses',
              label: 'Required Courses',
              type: 'relationship',
              relationTo: 'courses',
              hasMany: true,
              admin: {
                description: 'Courses that must be completed before starting this one.',
              },
            },
            {
              name: 'orderedChapters',
              label: 'Chapters (in order)',
              type: 'relationship',
              relationTo: 'chapters',
              hasMany: true,
              admin: {
                description: 'Drag and drop chapters to set the learning sequence.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              label: 'Meta Title',
              type: 'text',
              admin: {
                description:
                  'Title for search engines and browser tabs. Defaults to course name if empty.',
              },
            },
            {
              name: 'metaDescription',
              label: 'Meta Description',
              type: 'textarea',
              admin: {
                description:
                  'Short description for search engines (approx. 160 chars). Defaults to start of course description if empty.',
              },
            },
            {
              name: 'metaKeywords',
              label: 'Meta Keywords',
              type: 'text',
              admin: {
                description: 'Comma-separated keywords (optional, less impact nowadays).',
              },
            },
            {
              name: 'ogImage',
              label: 'Social Sharing Image (Open Graph)',
              type: 'relationship',
              relationTo: 'media',
              admin: {
                description:
                  'Image used when sharing the course link on social media (e.g., 1200x630px).',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'difficulty',
      label: 'Difficulty',
      type: 'select',
      required: true,
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
        { label: 'Expert', value: 'expert' },
      ],
      defaultValue: 'intermediate',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isProCourse',
      label: 'PRO Course?',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Check this box if the course requires a PRO subscription to access.',
      },
    },
  ],
}
