import type { CollectionConfig } from 'payload'

export const Tutorials: CollectionConfig = {
  slug: 'tutorials',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'tutorialStatus', 'updatedAt'],
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
      required: true,
      admin: {
        description: 'URL-friendly identifier for this tutorial. Will be used in the URL.',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
    },
    {
      name: 'tutorialStatus',
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
        description: 'Tutorial visibility (independent from the draft/publish system)',
      },
    },
    {
      name: 'sections',
      label: 'Sections',
      type: 'array',
      required: true,
      admin: {
        description: 'Sections of the tutorial, each containing a list of articles',
      },
      fields: [
        {
          name: 'title',
          label: 'Section Title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Section Description',
          type: 'textarea',
        },
        {
          name: 'articles',
          label: 'Articles',
          type: 'relationship',
          relationTo: 'articles',
          hasMany: true,
          required: true,
          admin: {
            description: 'Articles included in this section, in display order',
          },
        },
      ],
    },
    {
      name: 'exampleSections',
      label: 'Example Sections',
      type: 'array',
      admin: {
        description: 'Example sections for this tutorial, each grouping similar articles',
      },
      fields: [
        {
          name: 'title',
          label: 'Section Title',
          type: 'text',
          required: true,
        },
        {
          name: 'articles',
          label: 'Example Articles',
          type: 'relationship',
          relationTo: 'articles',
          hasMany: true,
          required: true,
          admin: {
            description: 'Example articles included in this section',
          },
        },
      ],
    },
    {
      name: 'referenceSections',
      label: 'Reference Article Sections',
      type: 'array',
      admin: {
        description: 'Reference article sections for this tutorial, organized by theme or category',
      },
      fields: [
        {
          name: 'title',
          label: 'Section Title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Section Description',
          type: 'textarea',
        },
        {
          name: 'articles',
          label: 'Reference Articles',
          type: 'relationship',
          relationTo: 'articles',
          hasMany: true,
          required: true,
          admin: {
            description: 'Reference articles included in this section',
          },
        },
      ],
    },
    {
      name: 'translations',
      label: 'Translations',
      type: 'array',
      admin: {
        description: 'Add translations for the tutorial title (the default language is English)',
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
      ],
    },
  ],
}
