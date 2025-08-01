import type { CollectionConfig } from 'payload'

export const Chapters: CollectionConfig = {
  slug: 'chapters',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'course', 'updatedAt'],
    group: 'Courses', // Group with Courses
  },
  access: {
    read: () => true
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Chapter Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true, // Consider if uniqueness should be scoped to the course later
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'requiredChapters',
      label: 'Required Chapters',
      type: 'relationship',
      relationTo: 'chapters', // Relation to self
      hasMany: true,
      admin: {
        description:
          'Chapters that must be completed before starting this one. This might be within the same course or another, use with caution.',
      },
    },
    {
      name: 'course',
      label: 'Course',
      type: 'relationship',
      relationTo: 'courses', // Link back to the parent Course
      required: true,
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'parts',
      label: 'Chapter Parts (Sequence)',
      type: 'relationship',
      relationTo: 'courseParts',
      hasMany: true,
      minRows: 1,
      admin: {
        description: 'The sequence of parts that make up this chapter.',
      },
    },
    // orderedParts and accessRequirements will be added later
  ],
}
