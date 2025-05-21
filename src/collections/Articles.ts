import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'articleStatus', 'difficultyLevel', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  // Enable version system with drafts
  versions: {
    drafts: true,
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
      admin: {
        description: 'URL-friendly identifier for this article. Will be used in the URL.',
      },
      required: true,
    },
    {
      name: 'subtitle',
      label: 'Subtitle',
      type: 'text',
    },
    {
      name: 'content',
      label: 'Content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'seo',
      label: 'SEO',
      type: 'group',
      admin: {
        description:
          'Information for search engine optimization (SEO) of the article in the main language (English)',
      },
      fields: [
        {
          name: 'title',
          label: 'SEO Title',
          type: 'text',
          admin: {
            description: 'Optimized title for search engines (if different from the main title)',
          },
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          admin: {
            description: 'Short description for search results (150-160 characters recommended)',
          },
        },
        {
          name: 'keywords',
          label: 'Keywords',
          type: 'array',
          admin: {
            description: 'Relevant keywords for SEO',
          },
          fields: [
            {
              name: 'keyword',
              label: 'Keyword',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'articleStatus',
      label: 'Visibility',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'active',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Article visibility (independent from the draft/publish system)',
      },
    },
    {
      name: 'difficultyLevel',
      label: 'Difficulty Level',
      type: 'select',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
      defaultValue: 'beginner',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Difficulty level of the article',
      },
    },
    {
      name: 'author',
      label: 'Author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'tags',
      label: 'Tags / Concepts',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        description: 'Concepts related to this article (e.g., "python", "object-oriented")',
        position: 'sidebar',
      },
    },
    {
      name: 'analytics',
      label: 'Analytics Metrics',
      type: 'group',
      admin: {
        description: 'Engagement metrics for this article (normally updated automatically)',
        position: 'sidebar',
        disableBulkEdit: true,
      },
      fields: [
        {
          name: 'views',
          label: 'Views',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Total number of article views',
          },
        },
        {
          name: 'uniqueViews',
          label: 'Unique Views',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of distinct visitors who viewed the article',
          },
        },
        {
          name: 'recommendationClicks',
          label: 'Recommendation Clicks',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of times the article was viewed from a recommendation',
          },
        },
        {
          name: 'averageTimeSpent',
          label: 'Average Time (seconds)',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Average time spent on the article in seconds',
          },
        },
        {
          name: 'bounceRate',
          label: 'Bounce Rate (%)',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Percentage of users who leave after viewing only this article',
          },
        },
        {
          name: 'ratingCount',
          label: 'Number of Ratings',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Total number of ratings received for this article',
          },
        },
        {
          name: 'ratingSum',
          label: 'Sum of Ratings',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Sum of all ratings (scale of 1 to 5) - allows calculating the average',
          },
        },
      ],
    },
    {
      name: 'translations',
      label: 'Translations',
      type: 'array',
      admin: {
        description: 'Add translations for this article (the default language is English)',
      },
      fields: [
        {
          name: 'language',
          label: 'Language',
          type: 'select',
          options: [
            { label: 'French', value: 'fr' },
            { label: 'Spanish', value: 'es' },
          ],
          required: true,
        },
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          required: true,
        },
        {
          name: 'subtitle',
          label: 'Subtitle',
          type: 'text',
        },
        {
          name: 'content',
          label: 'Content',
          type: 'textarea',
          required: true,
        },
        {
          name: 'translator',
          label: 'Translator',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'seo',
          label: 'SEO',
          type: 'group',
          admin: {
            description: 'Information for search engine optimization (SEO) of this translation',
          },
          fields: [
            {
              name: 'title',
              label: 'SEO Title',
              type: 'text',
              admin: {
                description:
                  'Optimized title for search engines (if different from the translated title)',
              },
            },
            {
              name: 'description',
              label: 'Description',
              type: 'textarea',
              admin: {
                description:
                  'Short description for search results (150-160 characters recommended)',
              },
            },
            {
              name: 'keywords',
              label: 'Keywords',
              type: 'array',
              admin: {
                description: 'Relevant keywords for SEO in this language',
              },
              fields: [
                {
                  name: 'keyword',
                  label: 'Keyword',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'relatedArticles',
      label: 'Related Articles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      admin: {
        description: 'Select articles that are related to this article',
      },
    },
    {
      name: 'prerequisites',
      label: 'Prerequisites',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      admin: {
        description: 'Articles that should be read before this one',
      },
    },
    {
      name: 'nextSteps',
      label: 'Next Steps',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      admin: {
        description: 'Recommended articles to read after this one',
      },
    },
  ],
}
